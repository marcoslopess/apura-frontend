'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate'
import { BarChart3, Users, Vote, CheckCircle2 } from 'lucide-react'
import { formatVotos, formatPercentual } from '@/lib/format'
import type { TotalizacaoInfo } from '@/lib/types'

interface TotalizationCardsProps {
  data: TotalizacaoInfo | null | undefined
}

export function TotalizationCards({ data }: TotalizationCardsProps) {
  const cards = [
    {
      title: 'Seções Apuradas',
      value: formatPercentual(data?.percentualSecoes ?? 0),
      detail: `${formatVotos(data?.secoesTotalizadas ?? 0)} de ${formatVotos(data?.secoesTotais ?? 0)}`,
      progress: data?.percentualSecoes ?? 0,
      icon: CheckCircle2,
      color: 'text-emerald-400',
    },
    {
      title: 'Comparecimento',
      value: formatPercentual(data?.percentualComparecimento ?? 0),
      detail: `${formatVotos(data?.comparecimento ?? 0)} eleitores`,
      progress: data?.percentualComparecimento ?? 0,
      icon: Users,
      color: 'text-blue-400',
    },
    {
      title: 'Votos Válidos',
      value: formatVotos(data?.votosValidos ?? 0),
      detail: `Brancos: ${formatVotos(data?.votosBrancos ?? 0)} · Nulos: ${formatVotos(data?.votosNulos ?? 0)}`,
      progress: null,
      icon: Vote,
      color: 'text-amber-400',
    },
    {
      title: 'Abstenção',
      value: formatPercentual(data?.percentualAbstencao ?? 0),
      detail: `${formatVotos(data?.abstencao ?? 0)} eleitores`,
      progress: data?.percentualAbstencao ?? 0,
      icon: BarChart3,
      color: 'text-red-400',
    },
  ]

  return (
    <Stagger className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <StaggerItem key={i}>
          <Card className="bg-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {card?.title}
                </span>
                <card.icon className={`h-4 w-4 ${card?.color}`} />
              </div>
              <div className="font-mono text-2xl font-bold tracking-tight mb-1">
                {card?.value}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {card?.detail}
              </div>
              {card?.progress != null && (
                <Progress value={card.progress} className="h-1.5" />
              )}
            </CardContent>
          </Card>
        </StaggerItem>
      ))}
    </Stagger>
  )
}
