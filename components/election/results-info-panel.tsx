'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatVotos, formatPercentual } from '@/lib/format'
import type { TotalizacaoInfo } from '@/lib/types'
import { Clock, CheckCircle2 } from 'lucide-react'

interface ResultsInfoPanelProps {
  data: TotalizacaoInfo | null | undefined
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground mb-3">
      {children}
    </h3>
  )
}

function Row({ label, value, swatch }: { label: string; value: string; swatch?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="flex items-center gap-2 text-muted-foreground">
        {swatch && (
          <span
            className="inline-block h-2.5 w-2.5 rounded-[3px]"
            style={{ backgroundColor: swatch }}
          />
        )}
        {label}
      </span>
      <span className="font-mono font-semibold tabular-nums text-foreground">{value}</span>
    </div>
  )
}

export function ResultsInfoPanel({ data }: ResultsInfoPanelProps) {
  const pctSecoes = data?.percentualSecoes ?? 0

  return (
    <Card className="lg:sticky lg:top-20">
      <CardContent className="p-5 space-y-6">
        {/* Dados Gerais */}
        <div>
          <SectionTitle>Dados Gerais</SectionTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Atualizado em{' '}
              <span className="font-mono text-foreground">
                {data?.dataGeracao || '—'}{data?.horaGeracao ? ` às ${data.horaGeracao}` : ''}
              </span>
            </span>
          </div>
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                Seções totalizadas
              </span>
              <span className="font-mono text-base font-bold text-primary">
                {formatPercentual(pctSecoes)}
              </span>
            </div>
            <Progress value={pctSecoes} className="h-2" />
            <div className="mt-2 text-[11px] text-muted-foreground font-mono">
              {formatVotos(data?.secoesTotalizadas ?? 0)} de {formatVotos(data?.secoesTotais ?? 0)}
            </div>
          </div>
        </div>

        {/* Votação */}
        <div>
          <SectionTitle>Votação</SectionTitle>
          <div className="divide-y divide-border/60">
            <Row label="Votos válidos" value={formatVotos(data?.votosValidos ?? 0)} swatch="hsl(var(--accent))" />
            <Row label="Votos em branco" value={formatVotos(data?.votosBrancos ?? 0)} swatch="hsl(var(--muted-foreground))" />
            <Row label="Votos nulos" value={formatVotos(data?.votosNulos ?? 0)} swatch="hsl(var(--destructive))" />
            {(data?.votosAnulados ?? 0) > 0 && (
              <Row label="Votos anulados" value={formatVotos(data?.votosAnulados ?? 0)} swatch="hsl(var(--warning))" />
            )}
          </div>
        </div>

        {/* Eleitorado */}
        <div>
          <SectionTitle>Eleitorado</SectionTitle>
          <div className="divide-y divide-border/60">
            {(data?.eleitoresTotal ?? 0) > 0 && (
              <Row label="Eleitorado apto" value={formatVotos(data?.eleitoresTotal ?? 0)} />
            )}
            <Row
              label="Comparecimento"
              value={`${formatVotos(data?.comparecimento ?? 0)} · ${formatPercentual(data?.percentualComparecimento ?? 0)}`}
            />
            <Row
              label="Abstenção"
              value={`${formatVotos(data?.abstencao ?? 0)} · ${formatPercentual(data?.percentualAbstencao ?? 0)}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
