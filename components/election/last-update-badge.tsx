'use client'

import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import { ClientOnly } from '@/components/client-only'

interface LastUpdateBadgeProps {
  dataGeracao?: string
  horaGeracao?: string
}

export function LastUpdateBadge({ dataGeracao, horaGeracao }: LastUpdateBadgeProps) {
  if (!dataGeracao || !horaGeracao) return null

  return (
    <Badge variant="outline" className="gap-1.5 font-mono text-[10px]">
      <Clock className="h-3 w-3" />
      <ClientOnly fallback={<span>--</span>}>
        <span suppressHydrationWarning>{dataGeracao} {horaGeracao}</span>
      </ClientOnly>
    </Badge>
  )
}
