/**
 * Adaptador: converte o formato normalizado do backend Apura (NestJS)
 * para o formato TseResultado que as telas já consomem.
 *
 * O backend retorna CacheEnvelope<NormalizedEa20Result>.
 * O frontend usa TseResultado (raw-style) + process-results.ts.
 * Este módulo traduz um para o outro sem alterar nenhum componente de tela.
 *
 * Campos e nomes: extraídos do arquivo elections.types.d.ts do backend de
 * referência — nada foi inventado.
 */

import type { TseResultado, TseCargo, TseCandidato, TseAgregacao, TsePartido, TseSecoes, TseEleitores, TseVotos } from './types'

// ---- Tipos do backend (espelham elections.types.d.ts) --------------------

export interface CandidateResult {
  numero: string
  sequencialCandidato: string
  nome: string
  nomeUrna: string
  partidoSigla: string
  partidoNome: string
  federacaoOuColigacaoNome: string
  federacaoOuColigacaoTipo: string
  situacao: string
  votos: number
  votosTexto: string
  percentual: number
  percentualTexto: string
  fotoUrl?: string
}

export interface NormalizedEa20Result {
  escopo: {
    eleicao: string
    turno: string
    abrangenciaTipo: string
    abrangenciaCodigo: string
    cargoCodigo: string
    cargoNome: string
  }
  atualizacao: {
    dataGeracao: string
    horaGeracao: string
    idg: string
    dataApuracao: string
    horaApuracao: string
  }
  secoes: Record<string, number | string>
  eleitores: Record<string, number | string>
  votos: Record<string, number | string>
  candidatos: CandidateResult[]
}

export interface CacheEnvelope<T> {
  sourceUrl: string
  fetchedAt: string
  idg?: string
  etag?: string
  lastModified?: string
  payload: T
}

// ---- Helpers de conversão ------------------------------------------------

function str(v: string | number | undefined | null): string {
  if (v == null) return ''
  return String(v)
}

function candidatoToTse(c: CandidateResult): TseCandidato {
  return {
    n: c.numero,
    sqcand: c.sequencialCandidato,
    nm: c.nome,
    nmu: c.nomeUrna,
    dt: '',
    dvt: 'Válido',
    seq: '',
    e: c.situacao?.toLowerCase()?.includes('eleit') ? 's' : 'n',
    st: c.situacao,
    vap: c.votosTexto ?? str(c.votos),
    pvap: c.percentualTexto ?? str(c.percentual),
    pvapn: str(c.percentual),
    foto: c.fotoUrl,
  }
}

/** Agrupa candidatos por partido, depois empacota em agregações isoladas. */
function buildAgregacoes(candidatos: CandidateResult[]): TseAgregacao[] {
  const porPartido = new Map<string, CandidateResult[]>()
  for (const c of candidatos) {
    const key = c.partidoSigla || 'IND'
    const arr = porPartido.get(key) ?? []
    arr.push(c)
    porPartido.set(key, arr)
  }

  const agrs: TseAgregacao[] = []
  for (const [sigla, cands] of porPartido) {
    const primeiro = cands[0]
    const totalVotos = cands.reduce((s, c) => s + c.votos, 0)
    const partido: TsePartido = {
      n: primeiro?.numero?.slice(0, 2) ?? '',
      sg: sigla,
      nm: primeiro?.partidoNome ?? sigla,
      nfed: '',
      tvtn: str(totalVotos),
      tvan: str(totalVotos),
      cand: cands.map(candidatoToTse),
    }
    agrs.push({
      n: '',
      nm: primeiro?.federacaoOuColigacaoNome ?? sigla,
      tp: primeiro?.federacaoOuColigacaoTipo === 'federacao' ? 'f' : 'i',
      com: '',
      tvtn: str(totalVotos),
      tvan: str(totalVotos),
      par: [partido],
    })
  }
  return agrs
}

function buildSecoes(raw: Record<string, number | string>): TseSecoes {
  return {
    ts: str(raw['ts'] ?? raw['totalSecoes']),
    st: str(raw['st'] ?? raw['secoesTotalizadas']),
    pst: str(raw['pst'] ?? raw['percentualTotalizadas']),
    pstn: str(raw['pstn'] ?? raw['percentualTotalizadasNum'] ?? raw['pst']),
    snt: str(raw['snt'] ?? ''),
    psnt: str(raw['psnt'] ?? ''),
    si: str(raw['si'] ?? ''),
    psi: str(raw['psi'] ?? ''),
    psin: str(raw['psin'] ?? ''),
    sni: str(raw['sni'] ?? ''),
    psni: str(raw['psni'] ?? ''),
    sa: str(raw['sa'] ?? ''),
    psa: str(raw['psa'] ?? ''),
    psan: str(raw['psan'] ?? ''),
    sna: str(raw['sna'] ?? ''),
    psna: str(raw['psna'] ?? ''),
  }
}

function buildEleitores(raw: Record<string, number | string>): TseEleitores {
  return {
    te: str(raw['te'] ?? raw['totalEleitores']),
    est: str(raw['est'] ?? raw['eleitoresSecaoTot'] ?? ''),
    pest: str(raw['pest'] ?? ''),
    c: str(raw['c'] ?? raw['comparecimento']),
    pc: str(raw['pc'] ?? raw['percentualComparecimento']),
    a: str(raw['a'] ?? raw['abstencao']),
    pa: str(raw['pa'] ?? raw['percentualAbstencao']),
  }
}

function buildVotos(raw: Record<string, number | string>): TseVotos {
  return {
    tv: str(raw['tv'] ?? raw['totalVotos']),
    vvc: str(raw['vvc'] ?? ''),
    pvvc: str(raw['pvvc'] ?? ''),
    vv: str(raw['vv'] ?? raw['votosValidos']),
    pvv: str(raw['pvv'] ?? ''),
    vnom: str(raw['vnom'] ?? raw['votosNominais']),
    pvnom: str(raw['pvnom'] ?? ''),
    van: str(raw['van'] ?? raw['votosAnulados']),
    pvan: str(raw['pvan'] ?? ''),
    vansj: str(raw['vansj'] ?? ''),
    pvansj: str(raw['pvansj'] ?? ''),
    vb: str(raw['vb'] ?? raw['votosBrancos']),
    pvb: str(raw['pvb'] ?? ''),
    tvn: str(raw['tvn'] ?? raw['votosNulos']),
    ptvn: str(raw['ptvn'] ?? ''),
    vn: str(raw['vn'] ?? ''),
    pvn: str(raw['pvn'] ?? ''),
    vnt: str(raw['vnt'] ?? ''),
    vsan: str(raw['vsan'] ?? ''),
    vscv: str(raw['vscv'] ?? ''),
  }
}

// ---- Conversor principal -------------------------------------------------

/**
 * Converte CacheEnvelope<NormalizedEa20Result> → TseResultado.
 * Aceita também o payload direto (sem envelope) para flexibilidade.
 */
export function normalizedToTseResultado(
  input: CacheEnvelope<NormalizedEa20Result> | NormalizedEa20Result,
): TseResultado {
  const data: NormalizedEa20Result = 'payload' in input ? input.payload : input

  const cargo: TseCargo = {
    cd: data.escopo?.cargoCodigo ?? '',
    nmn: data.escopo?.cargoNome ?? '',
    nmm: '',
    nmf: '',
    nv: '',
    agr: buildAgregacoes(data.candidatos ?? []),
  }

  return {
    ele: data.escopo?.eleicao ?? '',
    t: data.escopo?.turno ?? '1',
    f: 'N',
    sup: '',
    tpabr: data.escopo?.abrangenciaTipo ?? '',
    cdabr: data.escopo?.abrangenciaCodigo ?? '',
    dg: data.atualizacao?.dataGeracao ?? '',
    hg: data.atualizacao?.horaGeracao ?? '',
    idg: data.atualizacao?.idg ?? '',
    dt: data.atualizacao?.dataApuracao ?? '',
    ht: data.atualizacao?.horaApuracao ?? '',
    dv: '',
    tf: '',
    and: '',
    esae: '',
    carg: [cargo],
    s: buildSecoes(data.secoes ?? {}),
    e: buildEleitores(data.eleitores ?? {}),
    v: buildVotos(data.votos ?? {}),
  }
}
