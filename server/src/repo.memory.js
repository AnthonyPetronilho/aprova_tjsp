// Repositório em memória: usado nos testes e em desenvolvimento rápido (STORE=memory). NÃO persiste nada.
export function createMemoryRepo() {
  const users = new Map(), byEmail = new Map(), docs = new Map()
  let seq = 0
  return {
    kind: 'memory',
    async createUser({ email, passHash }) {
      if (byEmail.has(email)) return null
      const u = { id: String(++seq), email, passHash, createdAt: new Date().toISOString() }
      users.set(u.id, u); byEmail.set(email, u.id); return u
    },
    async findUserByEmail(email) { const id = byEmail.get(email); return id ? users.get(id) : null },
    async findUserById(id) { return users.get(id) ?? null },
    // documento por (usuário, tipo): { json, version, updatedAt }. putDoc usa controle otimista de versão.
    async getDoc(userId, kind) { return docs.get(`${userId}:${kind}`) ?? null },
    async putDoc(userId, kind, json, baseVersion) {
      const key = `${userId}:${kind}`, cur = docs.get(key)
      if ((cur?.version ?? 0) !== baseVersion) return { conflict: true, current: cur ?? null }
      const doc = { json, version: baseVersion + 1, updatedAt: new Date().toISOString() }
      docs.set(key, doc); return { doc }
    },
    async deleteUser(id) { const u = users.get(id); if (!u) return; users.delete(id); byEmail.delete(u.email); for (const k of [...docs.keys()]) if (k.startsWith(`${id}:`)) docs.delete(k) },
    async close() {},
  }
}
