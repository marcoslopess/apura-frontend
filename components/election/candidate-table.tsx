'use client'

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/ui/animate'
import { formatVotos, formatPercentual, corLegivel } from '@/lib/format'
import type { CandidatoProcessado } from '@/lib/types'
import { Trophy, User } from 'lucide-react'

interface CandidateTableProps {
  candidatos: CandidatoProcessado[]
  title?: string
}

export function CandidateTable({ candidatos, title }: CandidateTableProps) {
  const safeList = candidatos ?? []

  if (safeList.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Nenhum candidato encontrado
      </div>
    )
  }

  return (
    <FadeIn>
      <div className="rounded-lg border border-border/50 overflow-hidden">
        {title && (
          <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
            <h3 className="font-display font-semibold text-sm">{title}</h3>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Candidato</TableHead>
              <TableHead className="hidden sm:table-cell">Partido</TableHead>
              <TableHead className="text-right font-mono">Votos</TableHead>
              <TableHead className="text-right font-mono w-24">%</TableHead>
              <TableHead className="w-20 text-center">Situação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {safeList.map((cand: CandidatoProcessado, idx: number) => (
              <TableRow key={cand?.sqcand ?? idx} className="group">
                <TableCell className="text-center">
                  <div
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg font-mono font-bold text-xs"
                    style={{ backgroundColor: `${cand?.corPartido ?? '#666'}20`, color: corLegivel(cand?.corPartido) }}
                  >
                    {cand?.numero ?? ''}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{cand?.nomeUrna ?? cand?.nome ?? ''}</div>
                      <div className="text-xs text-muted-foreground sm:hidden">{cand?.siglaPartido ?? ''}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-muted">
                    {cand?.siglaPartido ?? ''}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono font-semibold tabular-nums">
                  {formatVotos(cand?.votos ?? 0)}
                </TableCell>
                <TableCell className="text-right font-mono font-bold tabular-nums">
                  <span style={{ color: corLegivel(cand?.corPartido) }}>
                    {formatPercentual(cand?.percentual ?? 0)}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {cand?.eleito ? (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                      <Trophy className="h-3 w-3 mr-1" />
                      Eleito
                    </Badge>
                  ) : cand?.situacao === '2º turno' ? (
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                      2º turno
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">{cand?.situacao ?? ''}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </FadeIn>
  )
}
