'use client'

import { AppShell } from '@/components/layouts/app-shell'
import { SidebarNav } from '@/components/election/sidebar-nav'
import { useCollectorStatus } from '@/hooks/use-election-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate'
import { Skeleton } from '@/components/ui/skeleton'
import { RefreshCw, Activity, Server, Wifi, Database, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { formatVotos } from '@/lib/format'
import { ClientOnly } from '@/components/client-only'
import Link from 'next/link'

export default function StatusPage() {
  const { data, isLoading, isError } = useCollectorStatus()
  const queryClient = useQueryClient()

  const handleRefresh = () => {
    queryClient?.invalidateQueries?.({ queryKey: ['collector-status'] })
  }

  const metrics = [
    { label: 'Coletas OK (último ciclo)', value: formatVotos(data?.lastPollOk ?? 0), icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Não encontrados', value: formatVotos(data?.lastPollNotFound ?? 0), icon: Activity, color: 'text-amber-400' },
    { label: 'Erros', value: formatVotos(data?.lastPollErrors ?? 0), icon: XCircle, color: 'text-red-400' },
    { label: 'Mudanças detectadas', value: formatVotos(data?.lastPollChanges ?? 0), icon: Server, color: 'text-blue-400' },
  ]

  return (
    <AppShell sidebar={<SidebarNav />} header={
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon-sm"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <h1 className="font-display font-bold text-base sm:text-lg tracking-tight">Status do Collector</h1>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={handleRefresh} title="Atualizar">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    }>
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
        </div>
      ) : isError ? (
        <Card className="border-destructive/50">
          <CardContent className="p-8 text-center">
            <p className="text-destructive font-medium">Erro ao carregar status</p>
            <Button variant="outline" className="mt-4" onClick={handleRefresh}>Tentar novamente</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Status geral */}
          <FadeIn>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Estado do Collector
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground">Status</span>
                    <div className="mt-1">
                      {data?.bootstrapped ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          {data?.polling ? 'Coletando' : 'Inicializado'}
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Parado</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Última Coleta</span>
                    <ClientOnly fallback={<p className="mt-1 font-mono text-sm">--</p>}>
                      <p className="mt-1 font-mono text-sm" suppressHydrationWarning>
                        {data?.lastPollFinishedAt ? new Date(data.lastPollFinishedAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : '—'}
                      </p>
                    </ClientOnly>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Pleitos Monitorados</span>
                    <p className="mt-1 font-mono text-2xl font-bold">{data?.pleitos?.length ?? 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Métricas de polling */}
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {metrics.map((m, i) => (
              <StaggerItem key={i}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">{m.label}</span>
                      <m.icon className={`h-4 w-4 ${m.color}`} />
                    </div>
                    <p className="font-mono text-2xl font-bold">{m.value}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>

          {/* Totais acumulados */}
          <FadeIn delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-primary" />
                  Totais Acumulados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground">Total de Coletas</span>
                    <p className="mt-1 font-mono text-2xl font-bold">{formatVotos(data?.totalPolls ?? 0)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Total de Mudanças</span>
                    <p className="mt-1 font-mono text-2xl font-bold">{formatVotos(data?.totalChanges ?? 0)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Duração Último Ciclo</span>
                    <p className="mt-1 font-mono text-2xl font-bold">{data?.lastPollDurationMs ?? 0}<span className="text-sm"> ms</span></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Configuração da fonte TSE */}
          <FadeIn delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  Fonte de Dados (TSE)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 font-mono text-xs">
                  <div className="flex justify-between gap-2"><span className="text-muted-foreground">Ambiente</span><span className="truncate">{data?.config?.env ?? '—'}</span></div>
                  <div className="flex justify-between gap-2"><span className="text-muted-foreground">Ciclo</span><span className="truncate">{data?.config?.cycle ?? '—'}</span></div>
                  <div className="flex justify-between gap-2"><span className="text-muted-foreground">Data-alvo</span><span className="truncate">{data?.config?.target ?? '—'}</span></div>
                  <div className="flex justify-between gap-2"><span className="text-muted-foreground">Intervalo</span><span className="truncate">{data?.config?.interval ? `${data.config.interval / 1000}s` : '—'}</span></div>
                  <div className="flex justify-between gap-2"><span className="text-muted-foreground">Cache</span><span className="truncate">{data?.cacheBackend ?? '—'}</span></div>
                  <div className="flex justify-between gap-2 sm:col-span-2"><span className="text-muted-foreground">Base</span><span className="truncate">{data?.config?.base ?? '—'}</span></div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <div className="text-center py-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground font-mono">
              Dados oficiais do TSE · Tribunal Superior Eleitoral
            </p>
          </div>
        </div>
      )}
    </AppShell>
  )
}
