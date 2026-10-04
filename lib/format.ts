// Brazilian formatting utilities

export function formatVotos(value: number | string): string {
  const num = typeof value === 'string' ? parseInt(value, 10) : value
  if (isNaN(num)) return '0'
  return num.toLocaleString('pt-BR')
}

export function formatPercentual(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value?.toString()?.replace(',', '.') ?? '0') : value
  if (isNaN(num)) return '0,00%'
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%'
}

export function formatPercentualNum(value: number | string | undefined | null): number {
  if (typeof value === 'string') {
    return parseFloat(value?.replace(',', '.') ?? '0') || 0
  }
  return value ?? 0
}

export function parseVotos(value: string | undefined | null): number {
  if (!value) return 0
  return parseInt(value?.replace(/\./g, '') ?? '0', 10) || 0
}

export function formatDataHora(data: string | undefined, hora: string | undefined): string {
  if (!data || !hora) return '—'
  return `${data} às ${hora}`
}

// Ajusta uma cor de partido (hex) para garantir contraste legível
// tanto no tema escuro quanto no claro, limitando a luminosidade.
export function corLegivel(hex: string | undefined | null): string {
  const fallback = '#5b9bd5'
  if (!hex) return fallback
  const m = hex.replace('#', '').trim()
  if (m.length !== 6) return fallback
  const r = parseInt(m.slice(0, 2), 16) / 255
  const g = parseInt(m.slice(2, 4), 16) / 255
  const b = parseInt(m.slice(4, 6), 16) / 255
  if ([r, g, b].some((v) => isNaN(v))) return fallback

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  const d = max - min
  const l = (max + min) / 2
  let s = 0
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1))
    switch (max) {
      case r: h = ((g - b) / d) % 6; break
      case g: h = (b - r) / d + 2; break
      default: h = (r - g) / d + 4; break
    }
    h *= 60
    if (h < 0) h += 360
  }

  // Limita a luminosidade a uma faixa legível em ambos os temas.
  const lClamp = Math.min(0.62, Math.max(0.52, l))
  const sClamp = Math.min(0.85, Math.max(0.45, s))

  const c = (1 - Math.abs(2 * lClamp - 1)) * sClamp
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const mm = lClamp - c / 2
  let rr = 0, gg = 0, bb = 0
  if (h < 60) { rr = c; gg = x }
  else if (h < 120) { rr = x; gg = c }
  else if (h < 180) { gg = c; bb = x }
  else if (h < 240) { gg = x; bb = c }
  else if (h < 300) { rr = x; bb = c }
  else { rr = c; bb = x }

  const toHex = (v: number) => Math.round((v + mm) * 255).toString(16).padStart(2, '0')
  return `#${toHex(rr)}${toHex(gg)}${toHex(bb)}`
}
