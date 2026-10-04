'use client'

import { useState } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Stagger, StaggerItem } from '@/components/ui/animate'
import { formatVotos, formatPercentual, corLegivel } from '@/lib/format'
import type { CandidatoProcessado } from '@/lib/types'
import { Trophy } from 'lucide-react'

interface CandidateCardsProps {
  candidatos: CandidatoProcessado[]
  title?: string
}

function iniciais(nome: string): string {
  const parts = (nome ?? '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function SituacaoBadge({ cand }: { cand: CandidatoProcessado }) {
  if (cand?.eleito) {
    return (
      <Badge className="bg-accent/15 text-accent border-accent/30 text-[11px]">
        <Trophy className="h-3 w-3 mr-1" /> Eleito
      </Badge>
    )
  }
  if (cand?.situacao === '2º turno') {
    return <Badge className="bg-warning/15 text-warning border-warning/30 text-[11px]">2º turno</Badge>
  }
  if (cand?.situacao) {
    return <span className="text-[11px] text-muted-foreground">{cand.situacao}</span>
  }
  return null
}

function Avatar({ cand, size = 'md' }: { cand: CandidatoProcessado; size?: 'md' | 'lg' }) {
  const cor = cand?.corPartido ?? 'hsl(var(--primary))'
  const dim = size === 'lg' ? 'h-16 w-16 text-lg' : 'h-12 w-12 text-sm'
  const [erro, setErro] = useState(false)
  const temFoto = !!cand?.foto && !erro
  return (
    <div
      className={`relative flex-shrink-0 ${dim} rounded-full flex items-center justify-center font-display font-bold text-white overflow-hidden`}
      style={{ backgroundColor: cor, boxShadow: `0 0 0 3px ${cor}33` }}
    >
      {temFoto ? (
        <img
          src={cand.foto as string}
          alt={`Foto de ${cand?.nomeUrna ?? cand?.nome ?? 'candidato'}`}
          className="h-full w-full object-cover"
          onError={() => setErro(true)}
          loading="lazy"
        />
      ) : (
        iniciais(cand?.nomeUrna ?? cand?.nome ?? '')
      )}
    </div>
  )
}

export function CandidateCards({ candidatos, title }: CandidateCardsProps) {
  const safeList = candidatos ?? []
  const [selected, setSelected] = useState<CandidatoProcessado | null>(null)

  if (safeList.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        Nenhum candidato encontrado
      </div>
    )
  }

  return (
    <div>
      {title && (
        <h3 className="font-display font-semibold text-sm mb-3">{title}</h3>
      )}
      <Stagger className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {safeList.map((cand: CandidatoProcessado, idx: number) => {
          const cor = cand?.corPartido ?? 'hsl(var(--primary))'
          const corTexto = corLegivel(cand?.corPartido)
          const lider = idx === 0
          return (
            <StaggerItem key={cand?.sqcand ?? idx}>
              <button
                type="button"
                onClick={() => setSelected(cand)}
                className="group w-full text-left rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={lider ? { borderColor: `${cor}66` } : undefined}
              >
                <div className="flex items-center gap-3">
                  <Avatar cand={cand} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold" style={{ color: corTexto }}>
                      <span>{cand?.siglaPartido ?? ''}</span>
                      <span className="text-muted-foreground">·</span>
                      <span>{cand?.numero ?? ''}</span>
                    </div>
                    <div className="font-display font-semibold text-sm truncate">
                      {cand?.nomeUrna ?? cand?.nome ?? ''}
                    </div>
                    <div className="mt-0.5"><SituacaoBadge cand={cand} /></div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-mono text-xl font-bold leading-none" style={{ color: corTexto }}>
                      {formatPercentual(cand?.percentual ?? 0)}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono mt-1">
                      {formatVotos(cand?.votos ?? 0)}
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <Progress value={cand?.percentual ?? 0} className="h-1.5" />
                </div>
              </button>
            </StaggerItem>
          )
        })}
      </Stagger>

      {/* Modal de perfil */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          {selected && (
            <>
              <div
                className="h-20 -mx-6 -mt-6 rounded-t-lg"
                style={{ background: `linear-gradient(135deg, ${selected.corPartido ?? 'hsl(var(--primary))'}, ${selected.corPartido ?? 'hsl(var(--primary))'}99)` }}
              />
              <div className="flex items-end gap-4 -mt-10 px-1">
                <div className="ring-4 ring-card rounded-full">
                  <Avatar cand={selected} size="lg" />
                </div>
                <div className="pb-1">
                  <SituacaoBadge cand={selected} />
                </div>
              </div>
              <DialogHeader className="text-left space-y-1 pt-1">
                <DialogTitle className="font-display">{selected.nomeUrna ?? selected.nome}</DialogTitle>
                {selected.nome && selected.nome !== selected.nomeUrna && (
                  <p className="text-sm text-muted-foreground">{selected.nome}</p>
                )}
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-lg bg-muted/40 p-3">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Partido</div>
                  <div className="font-semibold text-sm mt-0.5">{selected.siglaPartido}</div>
                  {selected.partido && selected.partido !== selected.siglaPartido && (
                    <div className="text-xs text-muted-foreground">{selected.partido}</div>
                  )}
                </div>
                <div className="rounded-lg bg-muted/40 p-3">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Número</div>
                  <div className="font-mono font-bold text-sm mt-0.5">{selected.numero}</div>
                </div>
                <div className="rounded-lg bg-muted/40 p-3">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Votos</div>
                  <div className="font-mono font-bold text-sm mt-0.5">{formatVotos(selected.votos ?? 0)}</div>
                </div>
                <div className="rounded-lg bg-muted/40 p-3">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Percentual</div>
                  <div className="font-mono font-bold text-sm mt-0.5" style={{ color: corLegivel(selected.corPartido) }}>
                    {formatPercentual(selected.percentual ?? 0)}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
