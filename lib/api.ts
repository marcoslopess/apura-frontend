import type { TseResultado, CollectorStatus, MunicipioInfo } from './types'
import { normalizedToTseResultado } from './api-adapter'
import type { CacheEnvelope, NormalizedEa20Result } from './api-adapter'
import {
  getMockPresidente, getMockGovernador, getMockSenador,
  getMockMunicipio, getMockCollectorStatus, MOCK_MUNICIPIOS, getMockCargo
} from './mock-data'

// Base relativa: as chamadas passam pelo proxy /backend (Route Handler) que encaminha
// ao backend real server-side, evitando CORS no navegador.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/backend'
const IS_MOCK = process.env.NEXT_PUBLIC_MOCK === 'true'

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Accept': 'application/json' },
  })
  if (!res?.ok) {
    throw new Error(`API error: ${res?.status} ${res?.statusText}`)
  }
  return res.json()
}

/** Busca do backend Apura (NestJS) e converte para TseResultado. */
async function fetchAndAdapt(path: string): Promise<TseResultado> {
  const envelope = await apiFetch<CacheEnvelope<NormalizedEa20Result>>(path)
  return normalizedToTseResultado(envelope)
}

// ---------- Endpoints públicos ----------

// Presidente (Brasil)
export async function fetchPresidente(): Promise<TseResultado> {
  if (IS_MOCK) return getMockPresidente()
  return fetchAndAdapt('/api/elections/2026/president')
}

// Governador por UF
export async function fetchGovernador(uf: string): Promise<TseResultado> {
  if (IS_MOCK) return getMockGovernador(uf)
  return fetchAndAdapt(`/api/elections/2026/states/${uf}/governor`)
}

// Senador por UF
export async function fetchSenador(uf: string): Promise<TseResultado> {
  if (IS_MOCK) return getMockSenador(uf)
  return fetchAndAdapt(`/api/elections/2026/states/${uf}/senator`)
}

// Resultados por UF (todos os cargos)
export async function fetchEstado(uf: string): Promise<TseResultado> {
  if (IS_MOCK) return getMockGovernador(uf)
  return fetchAndAdapt(`/api/elections/2026/states/${uf}`)
}

// Município
export async function fetchMunicipio(codigo: string): Promise<TseResultado> {
  if (IS_MOCK) return getMockMunicipio(codigo)
  return fetchAndAdapt(`/api/elections/2026/municipalities/${codigo}/results`)
}

// Resultado genérico por cargo (todos os cargos: país, estado, município)
export async function fetchResultadoCargo(
  nivel: 'br' | 'uf' | 'mu',
  codigo: string,
  cargo: string,
): Promise<TseResultado> {
  if (IS_MOCK) return getMockCargo(nivel, codigo, cargo)
  if (nivel === 'br') return fetchAndAdapt('/api/elections/2026/president')
  if (nivel === 'uf') return fetchAndAdapt(`/api/elections/2026/states/${codigo}?cargo=${cargo}`)
  return fetchAndAdapt(`/api/elections/2026/municipalities/${codigo}/results?cargo=${cargo}`)
}

// Status do collector
export async function fetchCollectorStatus(): Promise<CollectorStatus> {
  if (IS_MOCK) return getMockCollectorStatus()
  return apiFetch<CollectorStatus>('/api/elections/2026/status/collector')
}

// Lista de municípios
export async function fetchMunicipios(uf?: string): Promise<MunicipioInfo[]> {
  if (IS_MOCK) {
    if (uf) return MOCK_MUNICIPIOS.filter((m: MunicipioInfo) => m?.uf?.toLowerCase() === uf?.toLowerCase())
    return MOCK_MUNICIPIOS
  }
  const raw = await apiFetch<Array<{
    codigo?: string; codigoIbge?: string; nome?: string; uf?: string
  }>>(`/api/elections/2026/municipalities${uf ? `?uf=${uf}` : ''}`)
  return (raw ?? []).map((m) => ({
    cd: m?.codigo ?? '',
    cdi: m?.codigoIbge ?? '',
    nm: m?.nome ?? '',
    uf: m?.uf ?? '',
  }))
}

// Health check
export async function fetchHealth(): Promise<{ status: string }> {
  if (IS_MOCK) return { status: 'ok' }
  return apiFetch<{ status: string }>('/api/health')
}
