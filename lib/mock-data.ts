// Mock data based on real TSE EA20 structure
import type { TseResultado, CollectorStatus, MunicipioInfo } from './types'

let mockIdg = 175720276

function nextIdg(): string {
  mockIdg++
  return mockIdg.toString()
}

function makeCandidato(n: string, nome: string, partido: string, sigla: string, votos: string, pct: string, situacao: string, eleito: string) {
  return {
    n, sqcand: `4159${n}492`, nm: nome, nmu: nome, dt: '21/11/1974',
    dvt: 'Válido', seq: n, e: eleito, st: situacao,
    vap: votos, pvap: pct, pvapn: pct.replace(',', '.'),
    vs: []
  }
}

function makePartido(n: string, sg: string, nm: string, cands: any[]) {
  const totalVotos = cands.reduce((s: number, c: any) => s + parseInt(c.vap, 10), 0)
  return {
    n, sg, nm, nfed: '',
    tvtn: totalVotos.toString(), tvan: totalVotos.toString(),
    cand: cands
  }
}

export function getMockPresidente(): TseResultado {
  const candidatos = [
    makeCandidato('13', 'CANDIDATO A', 'PARTIDO 9990', 'P 9990', '52345678', '43,45', '2º turno', 'n'),
    makeCandidato('22', 'CANDIDATO B', 'PARTIDO 9991', 'P 9991', '48901234', '40,59', '2º turno', 'n'),
    makeCandidato('15', 'CANDIDATO C', 'PARTIDO 9992', 'P 9992', '9118235', '7,56', 'Não eleito', 'n'),
    makeCandidato('40', 'CANDIDATO D', 'PARTIDO 9993', 'P 9993', '5234567', '4,34', 'Não eleito', 'n'),
    makeCandidato('50', 'CANDIDATO E', 'PARTIDO 9994', 'P 9994', '3456789', '2,87', 'Não eleito', 'n'),
    makeCandidato('12', 'CANDIDATO F', 'PARTIDO 9995', 'P 9995', '1432100', '1,19', 'Não eleito', 'n'),
  ]

  return {
    ele: '21270', t: '1', f: 's', sup: 'n',
    tpabr: 'br', cdabr: 'br',
    dg: '05/10/2026', hg: '22:15:30', idg: nextIdg(),
    dt: '05/10/2026', ht: '22:15:00', dv: 's', tf: 's', and: 'f', esae: 'n',
    carg: [{
      cd: '1', nmn: 'Presidente', nmm: 'Presidente', nmf: 'Presidente', nv: '1',
      fed: [],
      agr: candidatos.map((c, i) => ({
        n: `6013${i}`, nm: `COLIGAÇÃO ${9980 + i}`, tp: 'c', com: '',
        tvtn: c.vap, tvan: c.vap,
        par: [makePartido(c.n, `P ${9990 + i}`, `PARTIDO ${9990 + i}`, [c])]
      }))
    }],
    s: {
      ts: '528951', st: '496821', pst: '93,92', pstn: '93.92',
      snt: '32130', psnt: '6,08',
      si: '496820', psi: '93,92', psin: '93.92', sni: '1', psni: '0,00',
      sa: '496820', psa: '100,00', psan: '100', sna: '0', psna: '0,00'
    },
    e: {
      te: '163079139', est: '153248000', pest: '93,92',
      c: '138863131', pc: '85,15',
      a: '24215741', pa: '14,85'
    },
    v: {
      tv: '138863131', vvc: '120488603', pvvc: '86,77',
      vv: '120488603', pvv: '86,77',
      vnom: '120488603', pvnom: '100,00',
      van: '9218887', pvan: '6,64',
      vansj: '10503573', pvansj: '7,56',
      vb: '5118018', pvb: '3,69', tvn: '4037623', ptvn: '2,91',
      vn: '4037623', pvn: '100,00', vnt: '0', vsan: '143627', vscv: '0'
    }
  }
}

export function getMockGovernador(uf: string): TseResultado {
  const ufUpper = (uf ?? 'go').toUpperCase()
  const candidatos = [
    makeCandidato('40', `CANDIDATO GOV ${ufUpper} A`, 'PARTIDO 9990', 'P 9990', '2345678', '52,35', 'Eleito', 's'),
    makeCandidato('22', `CANDIDATO GOV ${ufUpper} B`, 'PARTIDO 9991', 'P 9991', '1567890', '35,00', 'Não eleito', 'n'),
    makeCandidato('15', `CANDIDATO GOV ${ufUpper} C`, 'PARTIDO 9992', 'P 9992', '456789', '10,20', 'Não eleito', 'n'),
    makeCandidato('13', `CANDIDATO GOV ${ufUpper} D`, 'PARTIDO 9993', 'P 9993', '109876', '2,45', 'Não eleito', 'n'),
  ]

  return {
    ele: '21272', t: '1', f: 's', sup: 'n',
    tpabr: 'uf', cdabr: uf ?? 'go',
    dg: '05/10/2026', hg: '21:45:10', idg: nextIdg(),
    dt: '05/10/2026', ht: '21:45:00', dv: 's', tf: 's', and: 'f', esae: 'n',
    carg: [{
      cd: '3', nmn: 'Governador', nmm: 'Governador', nmf: 'Governador', nv: '1',
      fed: [],
      agr: candidatos.map((c, i) => ({
        n: `7013${i}`, nm: `COLIGAÇÃO GOV ${9980 + i}`, tp: 'c', com: '',
        tvtn: c.vap, tvan: c.vap,
        par: [makePartido(c.n, `P ${9990 + i}`, `PARTIDO ${9990 + i}`, [c])]
      }))
    }],
    s: {
      ts: '15890', st: '15200', pst: '95,66', pstn: '95.66',
      snt: '690', psnt: '4,34',
      si: '15200', psi: '95,66', psin: '95.66', sni: '0', psni: '0,00',
      sa: '15200', psa: '100,00', psan: '100', sna: '0', psna: '0,00'
    },
    e: {
      te: '4780233', est: '4573200', pest: '95,67',
      c: '3890567', pc: '81,39',
      a: '889666', pa: '18,61'
    },
    v: {
      tv: '3890567', vvc: '3480233', pvvc: '89,46',
      vv: '3480233', pvv: '89,46',
      vnom: '3480233', pvnom: '100,00',
      van: '210334', pvan: '5,41', vansj: '0', pvansj: '0,00',
      vb: '100000', pvb: '2,57', tvn: '100000', ptvn: '2,57',
      vn: '100000', pvn: '100,00', vnt: '0', vsan: '0', vscv: '0'
    }
  }
}

export function getMockSenador(uf: string): TseResultado {
  const ufUpper = (uf ?? 'go').toUpperCase()
  const candidatos = [
    makeCandidato('456', `CANDIDATO SEN ${ufUpper} A`, 'PARTIDO 9990', 'P 9990', '1890123', '48,50', 'Eleito', 's'),
    makeCandidato('789', `CANDIDATO SEN ${ufUpper} B`, 'PARTIDO 9991', 'P 9991', '1234567', '31,68', 'Não eleito', 'n'),
    makeCandidato('123', `CANDIDATO SEN ${ufUpper} C`, 'PARTIDO 9993', 'P 9993', '567890', '14,57', 'Não eleito', 'n'),
    makeCandidato('321', `CANDIDATO SEN ${ufUpper} D`, 'PARTIDO 9994', 'P 9994', '204321', '5,24', 'Não eleito', 'n'),
  ]

  const base = getMockGovernador(uf)
  return {
    ...base,
    carg: [{
      cd: '5', nmn: 'Senador', nmm: 'Senador', nmf: 'Senador', nv: '1',
      fed: [],
      agr: candidatos.map((c, i) => ({
        n: `8013${i}`, nm: `COLIGAÇÃO SEN ${9980 + i}`, tp: 'c', com: '',
        tvtn: c.vap, tvan: c.vap,
        par: [makePartido(c.n, `P ${9990 + i}`, `PARTIDO ${9990 + i}`, [c])]
      }))
    }],
    idg: nextIdg(),
  }
}

export function getMockMunicipio(codigo: string): TseResultado {
  const candidatos = [
    makeCandidato('40', 'CANDIDATO MUN A', 'PARTIDO 9990', 'P 9990', '12345', '52,35', 'Eleito', 's'),
    makeCandidato('22', 'CANDIDATO MUN B', 'PARTIDO 9991', 'P 9991', '8900', '37,73', 'Não eleito', 'n'),
    makeCandidato('15', 'CANDIDATO MUN C', 'PARTIDO 9992', 'P 9992', '2340', '9,92', 'Não eleito', 'n'),
  ]

  return {
    ele: '21272', t: '1', f: 's', sup: 'n',
    tpabr: 'mu', cdabr: codigo ?? '93254',
    dg: '05/10/2026', hg: '20:30:00', idg: nextIdg(),
    dt: '05/10/2026', ht: '20:30:00', dv: 's', tf: 's', and: 'f', esae: 'n',
    carg: [{
      cd: '3', nmn: 'Governador', nmm: 'Governador', nmf: 'Governador', nv: '1',
      fed: [],
      agr: candidatos.map((c, i) => ({
        n: `9013${i}`, nm: `COLIGAÇÃO MUN ${9980 + i}`, tp: 'c', com: '',
        tvtn: c.vap, tvan: c.vap,
        par: [makePartido(c.n, `P ${9990 + i}`, `PARTIDO ${9990 + i}`, [c])]
      }))
    }],
    s: {
      ts: '85', st: '82', pst: '96,47', pstn: '96.47',
      snt: '3', psnt: '3,53',
      si: '82', psi: '96,47', psin: '96.47', sni: '0', psni: '0,00',
      sa: '82', psa: '100,00', psan: '100', sna: '0', psna: '0,00'
    },
    e: {
      te: '38500', est: '37125', pest: '96,43',
      c: '31250', pc: '81,17',
      a: '7250', pa: '18,83'
    },
    v: {
      tv: '31250', vvc: '23585', pvvc: '75,47',
      vv: '23585', pvv: '75,47',
      vnom: '23585', pvnom: '100,00',
      van: '3890', pvan: '12,45', vansj: '0', pvansj: '0,00',
      vb: '1900', pvb: '6,08', tvn: '1875', ptvn: '6,00',
      vn: '1875', pvn: '100,00', vnt: '0', vsan: '0', vscv: '0'
    }
  }
}

export function getMockCollectorStatus(): CollectorStatus {
  const now = new Date()
  return {
    bootstrapped: true,
    lastBootstrapAt: new Date(now.getTime() - 180000).toISOString(),
    lastPollStartedAt: new Date(now.getTime() - 30000).toISOString(),
    lastPollFinishedAt: new Date(now.getTime() - 29600).toISOString(),
    lastPollDurationMs: 410,
    lastPollOk: 109,
    lastPollNotFound: 0,
    lastPollErrors: 0,
    lastPollChanges: 3,
    totalPolls: 7,
    totalChanges: 109,
    lastErrors: [],
    polling: false,
    cacheBackend: 'memory',
    config: {
      base: 'https://resultados-sim.tse.jus.br/simulado',
      env: 'simulado2026',
      cycle: 'ele2026',
      target: '2026-10-04',
      interval: 30000,
      timeout: 10000,
      retries: 3,
    },
    pleitos: [{ cd: '21270' }, { cd: '21272' }],
  }
}

export const MOCK_MUNICIPIOS: MunicipioInfo[] = [
  { cd: '93254', cdi: '5206206', nm: 'CRISTALINA', uf: 'GO' },
  { cd: '09210', cdi: '3550308', nm: 'SÃO PAULO', uf: 'SP' },
  { cd: '58696', cdi: '3304557', nm: 'RIO DE JANEIRO', uf: 'RJ' },
  { cd: '04278', cdi: '5300108', nm: 'BRASÍLIA', uf: 'DF' },
  { cd: '27855', cdi: '2927408', nm: 'SALVADOR', uf: 'BA' },
  { cd: '13897', cdi: '2304400', nm: 'FORTALEZA', uf: 'CE' },
  { cd: '41238', cdi: '3106200', nm: 'BELO HORIZONTE', uf: 'MG' },
  { cd: '75353', cdi: '4106902', nm: 'CURITIBA', uf: 'PR' },
  { cd: '88013', cdi: '4314902', nm: 'PORTO ALEGRE', uf: 'RS' },
  { cd: '60011', cdi: '1302603', nm: 'MANAUS', uf: 'AM' },
]

// ---------------------------------------------------------------------------
// Gerador genérico de resultados mock por cargo (todos os cargos)
// ---------------------------------------------------------------------------

type Nivel = 'br' | 'uf' | 'mu'

const CARGO_NOMES_MOCK: Record<string, string> = {
  '1': 'Presidente',
  '3': 'Governador',
  '5': 'Senador',
  '6': 'Deputado Federal',
  '7': 'Deputado Estadual',
  '8': 'Deputado Distrital',
}

function pct(a: number, b: number): string {
  if (!b) return '0,00'
  return ((a / b) * 100).toFixed(2).replace('.', ',')
}

function blocosTotalizacao(nivel: Nivel, validos: number) {
  const brancos = Math.round(validos * 0.03)
  const nulos = Math.round(validos * 0.04)
  const comparecimento = validos + brancos + nulos
  const eleitores = Math.round(comparecimento / 0.85)
  const abstencao = eleitores - comparecimento
  const secoesT = nivel === 'br' ? 528951 : nivel === 'uf' ? 15890 : 85
  const secoesTot = Math.round(secoesT * 0.96)

  return {
    s: {
      ts: String(secoesT), st: String(secoesTot), pst: '96,00', pstn: '96.00',
      snt: String(secoesT - secoesTot), psnt: '4,00',
      si: String(secoesTot), psi: '96,00', psin: '96.00', sni: '0', psni: '0,00',
      sa: String(secoesTot), psa: '100,00', psan: '100', sna: '0', psna: '0,00',
    },
    e: {
      te: String(eleitores), est: String(eleitores), pest: '96,00',
      c: String(comparecimento), pc: pct(comparecimento, eleitores),
      a: String(abstencao), pa: pct(abstencao, eleitores),
    },
    v: {
      tv: String(comparecimento), vvc: String(validos), pvvc: pct(validos, comparecimento),
      vv: String(validos), pvv: pct(validos, comparecimento),
      vnom: String(validos), pvnom: '100,00',
      van: '0', pvan: '0,00', vansj: '0', pvansj: '0,00',
      vb: String(brancos), pvb: pct(brancos, comparecimento),
      tvn: String(nulos), ptvn: pct(nulos, comparecimento),
      vn: String(nulos), pvn: '100,00', vnt: '0', vsan: '0', vscv: '0',
    },
  }
}

export function getMockCargo(nivel: Nivel, codigo: string, cargo: string): TseResultado {
  if (cargo === '1') return getMockPresidente()

  const nome = CARGO_NOMES_MOCK[cargo] ?? 'Cargo'
  const suf =
    nivel === 'uf' ? (codigo ?? 'go').toUpperCase()
    : nivel === 'mu' ? `MUN ${codigo}`
    : 'BR'

  const isDep = cargo === '6' || cargo === '7' || cargo === '8'
  const baseTotal = nivel === 'br' ? 120000000 : nivel === 'uf' ? 3500000 : 23000

  const pcts = isDep
    ? [18.5, 15.2, 12.8, 10.1, 8.4, 7.2, 6.0, 5.1]
    : [48.5, 31.7, 14.6, 5.2]

  const candidatos = pcts.map((p, i) => {
    const votos = Math.round((baseTotal * p) / 100)
    const eleito = isDep ? i < 3 : i === 0
    const situacao = isDep
      ? (i < 3 ? 'Eleito' : i < 5 ? 'Suplente' : 'Não eleito')
      : (i === 0 ? 'Eleito' : 'Não eleito')
    return makeCandidato(
      String(10 + i),
      `CANDIDATO ${nome.toUpperCase()} ${suf} ${String.fromCharCode(65 + i)}`,
      `PARTIDO ${9990 + i}`,
      `P ${9990 + i}`,
      String(votos),
      p.toFixed(2).replace('.', ','),
      situacao,
      eleito ? 's' : 'n',
    )
  })

  const validos = candidatos.reduce((s, c) => s + parseInt(c.vap, 10), 0)
  const blocos = blocosTotalizacao(nivel, validos)

  const tpabr = nivel === 'br' ? 'br' : nivel === 'uf' ? 'uf' : 'mu'
  const cdabr = nivel === 'br' ? 'br' : nivel === 'uf' ? (codigo ?? 'go') : (codigo ?? '93254')

  return {
    ele: '21272', t: '1', f: 's', sup: 'n',
    tpabr, cdabr,
    dg: '05/10/2026', hg: '21:45:10', idg: nextIdg(),
    dt: '05/10/2026', ht: '21:45:00', dv: 's', tf: 's', and: 'f', esae: 'n',
    carg: [{
      cd: cargo, nmn: nome, nmm: nome, nmf: nome, nv: '1',
      fed: [],
      agr: candidatos.map((c, i) => ({
        n: `${7000 + i}`, nm: `COLIGAÇÃO ${nome.toUpperCase()} ${9980 + i}`, tp: 'c', com: '',
        tvtn: c.vap, tvan: c.vap,
        par: [makePartido(c.n, `P ${9990 + i}`, `PARTIDO ${9990 + i}`, [c])],
      })),
    }],
    ...blocos,
  }
}
