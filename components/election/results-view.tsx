'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn } from '@/components/ui/animate'
import { BarChart3, PieChart } from 'lucide-react'
import { ResultsInfoPanel } from '@/components/election/results-info-panel'
import { CandidateCards } from '@/components/election/candidate-cards'
import { VoteBarChart } from '@/components/election/vote-bar-chart'
import { VoteDonutChart } from '@/components/election/vote-donut-chart'
import type { CandidatoProcessado, TotalizacaoInfo } from '@/lib/types'

interface ResultsViewProps {
  candidatos: CandidatoProcessado[]
  totalizacao: TotalizacaoInfo | null | undefined
  cardTitle?: string
  cargoTabs?: React.ReactNode
  showCharts?: boolean
}

export function ResultsView({
  candidatos,
  totalizacao,
  cardTitle,
  cargoTabs,
  showCharts = true,
}: ResultsViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6 items-start">
      {/* Coluna lateral de informações (estilo TSE) */}
      <ResultsInfoPanel data={totalizacao} />

      {/* Conteúdo principal */}
      <div className="space-y-6 min-w-0">
        {cargoTabs}

        <FadeIn>
          <CandidateCards candidatos={candidatos} title={cardTitle} />
        </FadeIn>

        {showCharts && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <FadeIn delay={0.1}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Votos por Candidato
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VoteBarChart candidatos={candidatos} />
                </CardContent>
              </Card>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-primary" />
                    Distribuição de Votos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VoteDonutChart candidatos={candidatos} />
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        )}

        <div className="text-center py-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground font-mono">
            Dados oficiais do TSE · Tribunal Superior Eleitoral
          </p>
        </div>
      </div>
    </div>
  )
}
