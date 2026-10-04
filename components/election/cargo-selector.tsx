'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CARGOS } from '@/lib/types'

interface CargoSelectorProps {
  cargos: string[] // códigos de cargo disponíveis
  selected: string
  onSelect: (cargo: string) => void
}

export function CargoSelector({ cargos, selected, onSelect }: CargoSelectorProps) {
  const safeCargos = cargos ?? []

  if (safeCargos.length <= 1) return null

  return (
    <Tabs value={selected} onValueChange={onSelect} className="w-full">
      <TabsList className="h-auto flex-wrap justify-start gap-1 bg-muted/40 p-1">
        {safeCargos.map((cd: string) => (
          <TabsTrigger
            key={cd}
            value={cd}
            className="rounded-md px-3 py-1.5 text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
          >
            {CARGOS[cd] ?? cd}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
