'use client'

import { Badge } from '@/components/ui/badge'
import { Wifi, WifiOff, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type WsStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

interface ConnectionBadgeProps {
  status: WsStatus
  isUpdating?: boolean
}

export function ConnectionBadge({ status, isUpdating }: ConnectionBadgeProps) {
  const configs: Record<WsStatus, { icon: React.ElementType; label: string; className: string }> = {
    connected: {
      icon: Wifi,
      label: isUpdating ? 'ATUALIZANDO...' : 'AO VIVO',
      className: isUpdating
        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse'
        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    connecting: {
      icon: Loader2,
      label: 'CONECTANDO...',
      className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    disconnected: {
      icon: WifiOff,
      label: 'DESCONECTADO',
      className: 'bg-muted text-muted-foreground border-border',
    },
    error: {
      icon: AlertCircle,
      label: 'ERRO CONEXÃO',
      className: 'bg-red-500/20 text-red-400 border-red-500/30',
    },
  }

  const config = configs[status ?? 'disconnected'] ?? configs.disconnected
  const Icon = config.icon

  return (
    <Badge className={cn('gap-1.5 font-mono text-[10px] tracking-wider', config.className)}>
      <Icon className={cn('h-3 w-3', status === 'connecting' && 'animate-spin')} />
      {config.label}
    </Badge>
  )
}
