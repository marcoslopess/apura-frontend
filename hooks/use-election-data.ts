'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchPresidente, fetchGovernador, fetchSenador, fetchMunicipio, fetchCollectorStatus, fetchMunicipios, fetchResultadoCargo } from '@/lib/api'
import type { TseResultado, CollectorStatus, MunicipioInfo } from '@/lib/types'

export function usePresidente() {
  return useQuery<TseResultado>({
    queryKey: ['presidente'],
    queryFn: fetchPresidente,
    refetchInterval: 30000, // fallback polling 30s
    staleTime: 10000,
  })
}

export function useGovernador(uf: string) {
  return useQuery<TseResultado>({
    queryKey: ['governador', uf],
    queryFn: () => fetchGovernador(uf),
    refetchInterval: 30000,
    staleTime: 10000,
    enabled: !!uf,
  })
}

export function useSenador(uf: string) {
  return useQuery<TseResultado>({
    queryKey: ['senador', uf],
    queryFn: () => fetchSenador(uf),
    refetchInterval: 30000,
    staleTime: 10000,
    enabled: !!uf,
  })
}

export function useMunicipio(codigo: string) {
  return useQuery<TseResultado>({
    queryKey: ['municipio', codigo],
    queryFn: () => fetchMunicipio(codigo),
    refetchInterval: 30000,
    staleTime: 10000,
    enabled: !!codigo,
  })
}

// Hook genérico: busca resultados de qualquer cargo em qualquer nível
export function useResultadoCargo(nivel: 'br' | 'uf' | 'mu', codigo: string, cargo: string) {
  return useQuery<TseResultado>({
    queryKey: ['resultado', nivel, codigo, cargo],
    queryFn: () => fetchResultadoCargo(nivel, codigo, cargo),
    refetchInterval: 30000,
    staleTime: 10000,
    enabled: !!codigo && !!cargo,
  })
}

export function useCollectorStatus() {
  return useQuery<CollectorStatus>({
    queryKey: ['collector-status'],
    queryFn: fetchCollectorStatus,
    refetchInterval: 5000,
    staleTime: 3000,
  })
}

export function useMunicipios(uf?: string) {
  return useQuery<MunicipioInfo[]>({
    queryKey: ['municipios', uf],
    queryFn: () => fetchMunicipios(uf),
    staleTime: 60000,
  })
}
