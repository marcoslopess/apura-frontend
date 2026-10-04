'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BarChart3, MapPin, Building2, Activity, Globe2, ChevronDown } from 'lucide-react'
import { UFS } from '@/lib/types'
import { useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

const NAV_ITEMS = [
  { href: '/', label: 'Brasil', icon: Globe2 },
  { href: '/status', label: 'Status', icon: Activity },
]

export function SidebarNav() {
  const pathname = usePathname()
  const [statesOpen, setStatesOpen] = useState(false)

  return (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div className="mb-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <span className="font-display font-bold text-sm tracking-tight">Apura por veltarc</span>
            <span className="block text-[10px] text-muted-foreground font-mono">Eleições 2026</span>
          </div>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}

        {/* Estados collapsible */}
        <Collapsible open={statesOpen} onOpenChange={setStatesOpen}>
          <CollapsibleTrigger className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-colors">
            <MapPin className="h-4 w-4" />
            <span className="flex-1 text-left">Estados</span>
            <ChevronDown className={cn('h-4 w-4 transition-transform', statesOpen && 'rotate-180')} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="ml-4 mt-1 space-y-0.5 max-h-60 overflow-y-auto scrollbar-none">
              {UFS.map((uf) => {
                const href = `/estados/${uf?.cd}`
                const isActive = pathname === href
                return (
                  <Link
                    key={uf?.cd}
                    href={href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <span className="font-mono uppercase w-5">{uf?.cd}</span>
                    <span>{uf?.ds}</span>
                  </Link>
                )
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Municípios */}
        <Link
          href="/municipios/93254"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            pathname?.startsWith('/municipios')
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <Building2 className="h-4 w-4" />
          Municípios
        </Link>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-border/50">
        <p className="text-[10px] text-muted-foreground text-center">
          Dados oficiais do TSE
        </p>
      </div>
    </div>
  )
}
