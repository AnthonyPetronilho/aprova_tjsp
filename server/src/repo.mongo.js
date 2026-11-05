import { MongoClient, ObjectId } from 'mongodb'
// Repositório MongoDB. Os dados do app ficam em um campo `json` (texto) para não esbarrar em restrições de nomes de campos.
export async function createMongoRepo(uri, dbName = 'aprova_tjsp') {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 })
  await client.connect()
  const db = client.db(dbName), users = db.collection('users'), docs = db.collection('docs'), hist = db.collection('docs_history')
  await users.createIndex({ email: 1 }, { unique: true })
  await docs.createIndex({ userId: 1, kind: 1 }, { unique: true })
  await hist.createIndex({ userId: 1, kind: 1, version: -1 })
  const oid = id => { try { return new ObjectId(id) } catch { return null } }
  const pubUser = u => u && { id: String(u._id), email: u.email, passHash: u.passHash, createdAt: u.createdAt }
  return {
    kind: 'mongo',
    async createUser({ email, passHash }) {
      try { const r = await users.insertOne({ email, passHash, createdAt: new Date().toISOString() }); return pubUser(await users.findOne({ _id: r.insertedId })) }
      catch (e) { if (e?.code === 11000) return null; throw e }
    },
    async findUserByEmail(email) { return pubUser(await users.findOne({ email })) },
    async findUserById(id) { const o = oid(id); return o ? pubUser(await users.findOne({ _id: o })) : null },
    async getDoc(userId, kind) { const d = await docs.findOne({ userId, kind }); return d && { json: d.json, version: d.version, updatedAt: d.updatedAt } },
    async putDoc(userId, kind, json, baseVersion) {
      const updatedAt = new Date().toISOString()
      if (baseVersion === 0) {
        try { await docs.insertOne({ userId, kind, json, version: 1, updatedAt }); return { doc: { json, version: 1, updatedAt } } }
        catch (e) { if (e?.code !== 11000) throw e; return { conflict: true, current: await this.getDoc(userId, kind) } }
      }
      const r = await docs.findOneAndUpdate({ userId, kind, version: baseVersion }, { $set: { json, updatedAt }, $inc: { version: 1 } }, { returnDocument: 'before' })
      if (!r) return { conflict: true, current: await this.getDoc(userId, kind) }
      // guarda a versão substituída (backup no servidor) e mantém só as 10 últimas
      await hist.insertOne({ userId, kind, version: r.version, json: r.json, updatedAt: r.updatedAt, savedAt: updatedAt })
      const old = await hist.find({ userId, kind }).sort({ version: -1 }).skip(10).project({ _id: 1 }).toArray()
      if (old.length) await hist.deleteMany({ _id: { $in: old.map(o => o._id) } })
      return { doc: { json, version: r.version + 1, updatedAt } }
    },
    async listHistory(userId, kind) { return (await hist.find({ userId, kind }).sort({ version: -1 }).toArray()).map(h => ({ json: h.json, version: h.version, updatedAt: h.updatedAt, savedAt: h.savedAt })) },
    async deleteUser(id) { const o = oid(id); if (!o) return; await users.deleteOne({ _id: o }); await docs.deleteMany({ userId: id }); await hist.deleteMany({ userId: id }) },
    async close() { await client.close() },
  }
}
