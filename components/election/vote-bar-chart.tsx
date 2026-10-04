'use client'

import dynamic from 'next/dynamic'
import type { CandidatoProcessado } from '@/lib/types'
import { formatVotos } from '@/lib/format'

const BarChartInner = dynamic(() => import('./vote-bar-chart-inner'), { ssr: false, loading: () => <div className="h-64 flex items-center justify-center text-muted-foreground">Carregando gráfico...</div> })

interface VoteBarChartProps {
  candidatos: CandidatoProcessado[]
}

export function VoteBarChart({ candidatos }: VoteBarChartProps) {
  return <BarChartInner candidatos={candidatos ?? []} />
}
