import type { TseResultado, CandidatoProcessado, TotalizacaoInfo, TseCargo, TseCandidato } from './types'
import { parseVotos, formatPercentualNum } from './format'

const CORES_PARTIDOS: Record<string, string> = {
  'P 9990': '#1565C0',
  'P 9991': '#C62828',
  'P 9992': '#2E7D32',
  'P 9993': '#E65100',
  'P 9994': '#6A1B9A',
  'P 9995': '#00838F',
  'P 9996': '#AD1457',
  'P 9997': '#4527A0',
  'P 9998': '#1B5E20',
  'P 9999': '#BF360C',
}

const CORES_DEFAULT = [
  '#1565C0', '#C62828', '#2E7D32', '#E65100', '#6A1B9A',
  '#00838F', '#AD1457', '#4527A0', '#EF6C00', '#00695C',
  '#283593', '#558B2F', '#D84315', '#4A148C', '#00796B',
]

export function extrairCandidatos(cargo: TseCargo | null | undefined): CandidatoProcessado[] {
  if (!cargo) return []
  const candidatos: CandidatoProcessado[] = []
  let corIndex = 0

  for (const agr of (cargo?.agr ?? [])) {
    for (const par of (agr?.par ?? [])) {
      for (const cand of (par?.cand ?? [])) {
        candidatos.push({
          numero: cand?.n ?? '',
          nome: cand?.nm ?? '',
          nomeUrna: cand?.nmu ?? cand?.nm ?? '',
          partido: par?.nm ?? '',
          siglaPartido: par?.sg ?? '',
          votos: parseVotos(cand?.vap),
          percentual: formatPercentualNum(cand?.pvap),
          situacao: cand?.st ?? '',
          eleito: cand?.e === 's',
          sqcand: cand?.sqcand ?? '',
          foto: cand?.foto,
          corPartido: CORES_PARTIDOS[par?.sg ?? ''] ?? CORES_DEFAULT[corIndex % CORES_DEFAULT.length],
        })
        corIndex++
      }
    }
  }

  return candidatos.sort((a, b) => b.votos - a.votos)
}

export function extrairTotalizacao(resultado: TseResultado | null | undefined): TotalizacaoInfo {
  const s = resultado?.s
  const e = resultado?.e
  const v = resultado?.v

  return {
    secoesTotais: parseVotos(s?.ts),
    secoesTotalizadas: parseVotos(s?.st),
    percentualSecoes: formatPercentualNum(s?.pst),
    eleitoresTotal: parseVotos(e?.te),
    comparecimento: parseVotos(e?.c),
    percentualComparecimento: formatPercentualNum(e?.pc),
    abstencao: parseVotos(e?.a),
    percentualAbstencao: formatPercentualNum(e?.pa),
    votosValidos: parseVotos(v?.vv),
    votosBrancos: parseVotos(v?.vb),
    votosNulos: parseVotos(v?.tvn),
    votosAnulados: parseVotos(v?.van),
    dataGeracao: resultado?.dg ?? '',
    horaGeracao: resultado?.hg ?? '',
    idg: resultado?.idg ?? '',
  }
}
