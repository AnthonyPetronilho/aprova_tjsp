// Extrai valores numéricos (pt-BR) de um texto de alternativa: "R$ 1.800,00", "7,5", "25%", "2/5", "−4".
export function numbersOf(text: string): number[] {
  const t = text.replace(/−/g, '-')
  const hm = t.match(/(\d+)\s*h\s*(\d+)\s*min/)
  if (hm) return [Number(hm[1]) + Number(hm[2]) / 60]
  const frac = t.match(/(\d+)\s*\/\s*(\d+)/)
  if (frac) return [Number(frac[1]) / Number(frac[2])]
  const m = t.match(/-?\d{1,3}(?:\.\d{3})+(?:,\d+)?|-?\d+(?:,\d+)?/g) || []
  return m.map(s => Number(s.replace(/\./g, '').replace(',', '.')))
}
