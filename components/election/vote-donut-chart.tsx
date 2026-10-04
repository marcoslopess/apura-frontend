'use client'

import dynamic from 'next/dynamic'
import type { CandidatoProcessado } from '@/lib/types'

const DonutChartInner = dynamic(() => import('./vote-donut-chart-inner'), { ssr: false, loading: () => <div className="h-64 flex items-center justify-center text-muted-foreground">Carregando gráfico...</div> })

interface VoteDonutChartProps {
  candidatos: CandidatoProcessado[]
}

export function VoteDonutChart({ candidatos }: VoteDonutChartProps) {
  return <DonutChartInner candidatos={candidatos ?? []} />
}
