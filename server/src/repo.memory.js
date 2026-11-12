// Repositório em memória: usado nos testes e em desenvolvimento rápido (STORE=memory). NÃO persiste nada.
export function createMemoryRepo() {
  const users = new Map(), byEmail = new Map(), docs = new Map(), history = new Map()
  let seq = 0
  // Fase 5 — catálogo editorial (separado do progresso das contas)
  const ed = new Map(), edHist = [], meta = { rev: 0 }
  const k = (kind, id) => `${kind}:${id}`
  const clone = x => (x === undefined ? undefined : JSON.parse(JSON.stringify(x)))
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
      if (cur) { const h = history.get(key) ?? []; h.push({ ...cur, savedAt: doc.updatedAt }); history.set(key, h.slice(-10)) }
      docs.set(key, doc); return { doc }
    },
    async listHistory(userId, kind) { return [...(history.get(`${userId}:${kind}`) ?? [])] },
    async deleteUser(id) { const u = users.get(id); if (!u) return; users.delete(id); byEmail.delete(u.email); for (const k of [...docs.keys()]) if (k.startsWith(`${id}:`)) docs.delete(k); for (const k of [...history.keys()]) if (k.startsWith(`${id}:`)) history.delete(k) },
    // ---- editorial: itens por (kind, id); rev = versão do item (controle otimista); catálogo tem um contador global de publicação
    async edInit(entries) { let n = 0; for (const e of entries) { const key = k(e.kind, e.id); if (!ed.has(key)) { ed.set(key, clone(e)); n++ } } return n },
    async edGet(kind, id) { return clone(ed.get(k(kind, id))) ?? null },
    async edList() { return [...ed.values()].map(clone) },
    async edCreate(rec, hist) { const key = k(rec.kind, rec.id); if (ed.has(key)) return { dup: true, current: clone(ed.get(key)) }; ed.set(key, clone(rec)); edHist.push(clone(hist)); if (hist.affectsCatalog) meta.rev++; return { rec: clone(rec) } },
    // troca atômica: só grava se a versão atual for a esperada; devolve conflito (com o estado atual) caso contrário
    async edUpdate(kind, id, expectedRev, fields, hist) {
      const key = k(kind, id), cur = ed.get(key)
      if (!cur) return { missing: true }
      if (cur.rev !== expectedRev) return { conflict: true, current: clone(cur) }
      const next = { ...cur, ...clone(fields), rev: cur.rev + 1 }; ed.set(key, next)
      edHist.push(clone({ ...hist, rev: next.rev })); if (hist.affectsCatalog) meta.rev++
      return { rec: clone(next) }
    },
    async edHistory(kind, id) { return edHist.filter(h => h.kind === kind && h.id === id).sort((a, b) => b.rev - a.rev).map(clone) },
    async edRecent(limit = 50) { return edHist.filter(h => h.type !== 'importacao').sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0)).slice(0, limit).map(clone) },
    async edCatalogRev() { return meta.rev },
    async close() {},
  }
}
