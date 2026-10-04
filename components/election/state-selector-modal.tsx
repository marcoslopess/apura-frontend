'use client'

import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { UFS } from '@/lib/types'
import { MapPin, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StateSelectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedUf?: string
  onSelect: (uf: string) => void
}

export function StateSelectorModal({ open, onOpenChange, selectedUf, onSelect }: StateSelectorModalProps) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return UFS
    return UFS.filter((u) => u?.ds?.toLowerCase()?.includes(q) || u?.cd?.toLowerCase()?.includes(q))
  }, [search])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Selecione o estado
          </DialogTitle>
          <DialogDescription>
            Escolha a unidade da federação para ver Governador, Senador e Deputados.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar estado..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e?.target?.value ?? '')}
            className="pl-9"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[55vh] overflow-y-auto pr-1">
          {filtered.map((uf) => (
            <button
              key={uf?.cd}
              onClick={() => onSelect(uf?.cd ?? '')}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                selectedUf === uf?.cd
                  ? 'border-primary bg-primary/10 text-primary font-semibold'
                  : 'border-border hover:border-primary/50 hover:bg-muted',
              )}
            >
              <span className="font-mono text-xs uppercase w-6 shrink-0">{uf?.cd}</span>
              <span className="truncate">{uf?.ds}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-sm text-muted-foreground py-6">
              Nenhum estado encontrado.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
