import { MongoClient, ObjectId } from 'mongodb'
// Repositório MongoDB. Os dados do app ficam em um campo `json` (texto) para não esbarrar em restrições de nomes de campos.
export async function createMongoRepo(uri, dbName = 'aprova_tjsp') {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 })
  await client.connect()
  const db = client.db(dbName), users = db.collection('users'), docs = db.collection('docs'), hist = db.collection('docs_history')
  await users.createIndex({ email: 1 }, { unique: true })
  await docs.createIndex({ userId: 1, kind: 1 }, { unique: true })
  await hist.createIndex({ userId: 1, kind: 1, version: -1 })
  // Fase 5 — catálogo editorial: ed_items (um registro por conteúdo), ed_history (um registro por versão), ed_meta (contador de publicação)
  const items = db.collection('ed_items'), eh = db.collection('ed_history'), em = db.collection('ed_meta')
  await items.createIndex({ kind: 1, id: 1 }, { unique: true })
  await eh.createIndex({ kind: 1, id: 1, rev: -1 }, { unique: true })
  await eh.createIndex({ at: -1 })
  const strip = d => { if (!d) return null; const { _id, ...r } = d; return r }
  const bump = () => em.updateOne({ _id: 'catalog' }, { $inc: { rev: 1 } }, { upsert: true })
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
    async edInit(entries) {
      if (!entries.length) return 0
      const r = await items.bulkWrite(entries.map(({ kind, id, ...rest }) => ({ updateOne: { filter: { kind, id }, update: { $setOnInsert: rest }, upsert: true } })), { ordered: false })
      return r.upsertedCount
    },
    async edGet(kind, id) { return strip(await items.findOne({ kind, id })) },
    async edList() { return (await items.find({}).toArray()).map(strip) },
    async edCreate(rec, hist) {
      try { await items.insertOne({ ...rec }) } catch (e) { if (e?.code === 11000) return { dup: true, current: await this.edGet(rec.kind, rec.id) }; throw e }
      try { await eh.insertOne({ ...hist }) } catch (e) { if (e?.code !== 11000) throw e }
      if (hist.affectsCatalog) await bump()
      return { rec }
    },
    // findOneAndUpdate com filtro por rev: operação atômica de comparar-e-trocar (dois administradores nunca gravam sobre a mesma versão)
    async edUpdate(kind, id, expectedRev, fields, hist) {
      const r = await items.findOneAndUpdate({ kind, id, rev: expectedRev }, { $set: fields, $inc: { rev: 1 } }, { returnDocument: 'after' })
      if (!r) { const cur = await this.edGet(kind, id); return cur ? { conflict: true, current: cur } : { missing: true } }
      const rec = strip(r)
      try { await eh.insertOne({ ...hist, rev: rec.rev }) } catch (e) { if (e?.code !== 11000) throw e }
      if (hist.affectsCatalog) await bump()
      return { rec }
    },
    async edHistory(kind, id) { return (await eh.find({ kind, id }).sort({ rev: -1 }).toArray()).map(strip) },
    async edRecent(limit = 50) { return (await eh.find({ type: { $ne: 'importacao' } }).sort({ at: -1 }).limit(limit).toArray()).map(strip) },
    async edCatalogRev() { return (await em.findOne({ _id: 'catalog' }))?.rev ?? 0 },
    async close() { await client.close() },
  }
}
