// TSE data types based on real JSON structure (EA20)

export interface TseCandidato {
  n: string       // número do candidato
  sqcand: string  // sequencial
  nm: string      // nome
  nmu: string     // nome urna
  dt: string      // data nascimento
  dvt: string     // destino voto (Válido, Nulo, etc.)
  seq: string     // sequência
  e: string       // eleito (s/n)
  st: string      // situação (Eleito, Não eleito, 2º turno)
  vap: string     // votos apurados
  pvap: string    // % votos apurados
  pvapn: string   // % numérico sem formatação
  foto?: string   // URL da foto (adicionado pelo frontend)
  vs?: TseVotoSubTipo[]
}

export interface TseVotoSubTipo {
  tp: string
  sqcand: string
  nm: string
}

export interface TsePartido {
  n: string       // número
  sg: string      // sigla
  nm: string      // nome
  nfed: string
  tvtn: string    // total votos turno nominal
  tvan: string    // total votos apurados nominal
  cand: TseCandidato[]
}

export interface TseAgregacao {
  n: string
  nm: string     // nome (federação/coligação)
  tp: string     // tipo: f=federação, c=coligação, i=isolado
  com: string
  tvtn: string
  tvan: string
  par: TsePartido[]
}

export interface TseFederacao {
  n: string
  sg: string
  nm: string
  com: string
  npar: TsePartido[]
}

export interface TseCargo {
  cd: string      // código (1=pres, 3=gov, 5=sen, 6=depfed, 7=depest)
  nmn: string     // nome por extenso
  nmm: string
  nmf: string
  nv: string
  fed?: TseFederacao[]
  agr: TseAgregacao[]
}

export interface TseSecoes {
  ts: string      // total seções
  st: string      // seções totalizadas
  pst: string     // % totalizadas
  pstn: string    // % numérica
  snt: string     // não totalizadas
  psnt: string
  si: string      // informadas
  psi: string
  psin: string
  sni: string
  psni: string
  sa: string      // apuradas
  psa: string
  psan: string
  sna: string
  psna: string
}

export interface TseEleitores {
  te: string      // total eleitores
  est: string     // eleitores totalizados
  pest: string    // % totalizados
  c: string       // comparecimento
  pc: string      // % comparecimento
  a: string       // abstenção
  pa: string      // % abstenção
}

export interface TseVotos {
  tv: string      // total votos
  vvc: string     // votos válidos computados
  pvvc: string    // % válidos
  vv: string      // válidos
  pvv: string
  vnom: string    // nominais
  pvnom: string
  van: string     // anulados
  pvan: string
  vansj: string   // anulados sub-judice
  pvansj: string
  vb: string      // brancos
  pvb: string
  tvn: string     // nulos
  ptvn: string
  vn: string
  pvn: string
  vnt: string
  vsan: string    // votos seção anulada
  vscv: string
}

export interface TseResultado {
  ele: string
  t: string       // turno
  f: string       // finalizado
  sup: string
  tpabr: string   // tipo abrangência (br, uf, mu)
  cdabr: string   // código abrangência
  dg: string      // data geração
  hg: string      // hora geração
  idg: string     // identificador geração (detecção de mudança)
  dt: string
  ht: string
  dv: string
  tf: string
  and: string
  esae: string
  carg: TseCargo[]
  s: TseSecoes
  e: TseEleitores
  v: TseVotos
}

// Tipos derivados (processados pelo frontend)

export interface CandidatoProcessado {
  numero: string
  nome: string
  nomeUrna: string
  partido: string
  siglaPartido: string
  votos: number
  percentual: number
  situacao: string
  eleito: boolean
  sqcand: string
  foto?: string
  corPartido?: string
}

export interface TotalizacaoInfo {
  secoesTotais: number
  secoesTotalizadas: number
  percentualSecoes: number
  eleitoresTotal: number
  comparecimento: number
  percentualComparecimento: number
  abstencao: number
  percentualAbstencao: number
  votosValidos: number
  votosBrancos: number
  votosNulos: number
  votosAnulados: number
  dataGeracao: string
  horaGeracao: string
  idg: string
}

export interface CargoInfo {
  codigo: string
  nome: string
}

// Backend API types

export interface CollectorStatus {
  bootstrapped: boolean
  lastBootstrapAt: string | null
  lastPollStartedAt: string | null
  lastPollFinishedAt: string | null
  lastPollDurationMs: number
  lastPollOk: number
  lastPollNotFound: number
  lastPollErrors: number
  lastPollChanges: number
  totalPolls: number
  totalChanges: number
  lastErrors: string[]
  polling: boolean
  cacheBackend: string
  config: {
    base: string
    env: string
    cycle: string
    target: string
    interval: number
    timeout: number
    retries: number
  }
  pleitos?: Array<Record<string, unknown>>
}

export interface UfInfo {
  cd: string  // sigla UF
  ds: string  // nome UF
}

export interface MunicipioInfo {
  cd: string  // código TSE 5 dígitos
  cdi: string // código IBGE 7 dígitos
  nm: string  // nome
  uf: string  // sigla UF
}

// Constantes
export const CARGOS: Record<string, string> = {
  '1': 'Presidente',
  '3': 'Governador',
  '5': 'Senador',
  '6': 'Deputado Federal',
  '7': 'Deputado Estadual',
  '8': 'Deputado Distrital',
}

export const UFS: UfInfo[] = [
  { cd: 'ac', ds: 'Acre' }, { cd: 'al', ds: 'Alagoas' }, { cd: 'am', ds: 'Amazonas' },
  { cd: 'ap', ds: 'Amapá' }, { cd: 'ba', ds: 'Bahia' }, { cd: 'ce', ds: 'Ceará' },
  { cd: 'df', ds: 'Distrito Federal' }, { cd: 'es', ds: 'Espírito Santo' },
  { cd: 'go', ds: 'Goiás' }, { cd: 'ma', ds: 'Maranhão' }, { cd: 'mg', ds: 'Minas Gerais' },
  { cd: 'ms', ds: 'Mato Grosso do Sul' }, { cd: 'mt', ds: 'Mato Grosso' },
  { cd: 'pa', ds: 'Pará' }, { cd: 'pb', ds: 'Paraíba' }, { cd: 'pe', ds: 'Pernambuco' },
  { cd: 'pi', ds: 'Piauí' }, { cd: 'pr', ds: 'Paraná' }, { cd: 'rj', ds: 'Rio de Janeiro' },
  { cd: 'rn', ds: 'Rio Grande do Norte' }, { cd: 'ro', ds: 'Rondônia' },
  { cd: 'rr', ds: 'Roraima' }, { cd: 'rs', ds: 'Rio Grande do Sul' },
  { cd: 'sc', ds: 'Santa Catarina' }, { cd: 'se', ds: 'Sergipe' },
  { cd: 'sp', ds: 'São Paulo' }, { cd: 'to', ds: 'Tocantins' },
]

// Cargos disponíveis por nível de abrangência (Eleições Gerais 2026)
// País: apenas Presidente. Estado/Município: cargos federais e estaduais.
export const CARGOS_PAIS = ['1'] // Presidente
export const CARGOS_ESTADO = ['3', '5', '6', '7'] // Governador, Senador, Dep. Federal, Dep. Estadual
export const CARGOS_ESTADO_DF = ['3', '5', '6', '8'] // Governador, Senador, Dep. Federal, Dep. Distrital

// Retorna os códigos de cargo aplicáveis a uma UF (DF usa Deputado Distrital).
export function cargosDaUf(uf?: string | null): string[] {
  return (uf ?? '').toLowerCase() === 'df' ? CARGOS_ESTADO_DF : CARGOS_ESTADO
}
