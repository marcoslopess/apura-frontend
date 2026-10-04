'use client'

import { useState, useMemo, use } from 'react'
import { AppShell } from '@/components/layouts/app-shell'
import { SidebarNav } from '@/components/election/sidebar-nav'
import { ResultsView } from '@/components/election/results-view'
import { ConnectionBadge } from '@/components/election/connection-badge'
import { LastUpdateBadge } from '@/components/election/last-update-badge'
import { useResultadoCargo, useMunicipios } from '@/hooks/use-election-data'
import { CargoSelector } from '@/components/election/cargo-selector'
import { useWebSocket } from '@/hooks/use-websocket'
import { extrairCandidatos, extrairTotalizacao } from '@/lib/process-results'
import { CARGOS, UFS, cargosDaUf } from '@/lib/types'
import { MOCK_MUNICIPIOS } from '@/lib/mock-data'
import type { MunicipioInfo } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, ArrowLeft, Search } from 'lucide-react'
import { FadeIn } from '@/components/ui/animate'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function MunicipioPage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedUf, setSelectedUf] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const ufMunicipio = useMemo(
    () => MOCK_MUNICIPIOS.find((m) => m?.cd === codigo)?.uf?.toLowerCase(),
    [codigo],
  )
  const cargosMun = useMemo(() => cargosDaUf(ufMunicipio), [ufMunicipio])
  const [cargo, setCargo] = useState(cargosMun[0]) // Governador por padrão
  const cargoAtivo = cargosMun.includes(cargo) ? cargo : cargosMun[0]

  const { data, isLoading, isError } = useResultadoCargo('mu', codigo, cargoAtivo)
  const { data: municipios } = useMunicipios(selectedUf || undefined)
  const { status: wsStatus, isUpdating } = useWebSocket({ scope: codigo })

  const candidatos = useMemo(() => extrairCandidatos(data?.carg?.[0]), [data])
  const totalizacao = useMemo(() => extrairTotalizacao(data), [data])

  const cargoNome = CARGOS[cargoAtivo] ?? data?.carg?.[0]?.nmn ?? 'Cargo'

  const filteredMunicipios = useMemo(() => {
    if (!municipios) return []
    if (!searchTerm) return municipios
    return municipios.filter((m: MunicipioInfo) =>
      m?.nm?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    )
  }, [municipios, searchTerm])

  const handleRefresh = () => {
    queryClient?.invalidateQueries?.({ queryKey: ['resultado', 'mu', codigo, cargoAtivo] })
  }

  const handleMunicipioSelect = (cd: string) => {
    router.push(`/municipios/${cd}`)
  }

  return (
    <AppShell sidebar={<SidebarNav />} header={
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon-sm"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <h1 className="font-display font-bold text-base sm:text-lg tracking-tight">
            Município {codigo}
          </h1>
          <ConnectionBadge status={wsStatus} isUpdating={isUpdating} />
        </div>
        <div className="flex items-center gap-2">
          <LastUpdateBadge dataGeracao={totalizacao?.dataGeracao} horaGeracao={totalizacao?.horaGeracao} />
          <Button variant="ghost" size="icon-sm" onClick={handleRefresh} title="Atualizar">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    }>
      <div className="space-y-6">
        {/* Seletor de município */}
        <FadeIn>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-40">
                  <Select value={selectedUf} onValueChange={setSelectedUf}>
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {UFS.map((uf) => (
                        <SelectItem key={uf?.cd} value={uf?.cd ?? ''}>
                          {uf?.cd?.toUpperCase()} — {uf?.ds}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar município..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e?.target?.value ?? '')}
                    className="pl-9"
                  />
                </div>
              </div>
              {filteredMunicipios && (filteredMunicipios?.length ?? 0) > 0 && searchTerm && (
                <div className="mt-2 max-h-40 overflow-y-auto rounded border border-border bg-popover">
                  {filteredMunicipios.slice(0, 10).map((m: MunicipioInfo) => (
                    <button
                      key={m?.cd}
                      onClick={() => handleMunicipioSelect(m?.cd ?? '')}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <span className="font-medium">{m?.nm}</span>
                      <span className="text-muted-foreground ml-2">{m?.uf} · {m?.cd}</span>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6">
            <Skeleton className="h-80 rounded-lg" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
            </div>
          </div>
        ) : isError ? (
          <Card className="border-destructive/50">
            <CardContent className="p-8 text-center">
              <p className="text-destructive font-medium">Erro ao carregar dados do município</p>
              <Button variant="outline" className="mt-4" onClick={handleRefresh}>Tentar novamente</Button>
            </CardContent>
          </Card>
        ) : (
          <ResultsView
            candidatos={candidatos}
            totalizacao={totalizacao}
            cardTitle={`${cargoNome} — Município ${codigo}`}
            cargoTabs={
              <CargoSelector cargos={cargosMun} selected={cargoAtivo} onSelect={setCargo} />
            }
          />
        )}
      </div>
    </AppShell>
  )
}
