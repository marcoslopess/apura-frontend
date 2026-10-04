'use client'

import { useState, useMemo, use } from 'react'
import { AppShell } from '@/components/layouts/app-shell'
import { SidebarNav } from '@/components/election/sidebar-nav'
import { ResultsView } from '@/components/election/results-view'
import { ConnectionBadge } from '@/components/election/connection-badge'
import { LastUpdateBadge } from '@/components/election/last-update-badge'
import { CargoSelector } from '@/components/election/cargo-selector'
import { useResultadoCargo } from '@/hooks/use-election-data'
import { useWebSocket } from '@/hooks/use-websocket'
import { extrairCandidatos, extrairTotalizacao } from '@/lib/process-results'
import { UFS, CARGOS, cargosDaUf } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { RefreshCw, ArrowLeft } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'

export default function EstadoPage({ params }: { params: Promise<{ uf: string }> }) {
  const { uf } = use(params)
  const cargosUf = useMemo(() => cargosDaUf(uf), [uf])
  const [cargo, setCargo] = useState(cargosUf[0]) // Governador por padrão
  const cargoAtivo = cargosUf.includes(cargo) ? cargo : cargosUf[0]
  const queryClient = useQueryClient()

  const { data: currentData, isLoading } = useResultadoCargo('uf', uf, cargoAtivo)
  const { status: wsStatus, isUpdating } = useWebSocket({ scope: uf })

  const candidatos = useMemo(() => extrairCandidatos(currentData?.carg?.[0]), [currentData])
  const totalizacao = useMemo(() => extrairTotalizacao(currentData), [currentData])

  const ufInfo = UFS.find((u) => u?.cd === uf)
  const ufNome = ufInfo?.ds ?? uf?.toUpperCase()

  const handleRefresh = () => {
    queryClient?.invalidateQueries?.({ queryKey: ['resultado', 'uf', uf, cargoAtivo] })
  }

  return (
    <AppShell sidebar={<SidebarNav />} header={
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon-sm"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <h1 className="font-display font-bold text-base sm:text-lg tracking-tight">
            {ufNome}
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
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6">
          <Skeleton className="h-80 rounded-lg" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
          </div>
        </div>
      ) : (
        <ResultsView
          candidatos={candidatos}
          totalizacao={totalizacao}
          cardTitle={`${CARGOS[cargoAtivo] ?? 'Cargo'} — ${ufNome}`}
          cargoTabs={
            <CargoSelector cargos={cargosUf} selected={cargoAtivo} onSelect={setCargo} />
          }
        />
      )}
    </AppShell>
  )
}
