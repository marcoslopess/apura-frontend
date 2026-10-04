'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts'
import type { CandidatoProcessado } from '@/lib/types'
import { formatVotos } from '@/lib/format'

interface Props {
  candidatos: CandidatoProcessado[]
}

export default function VoteBarChartInner({ candidatos }: Props) {
  const safeList = (candidatos ?? []).slice(0, 10)

  if (safeList.length === 0) {
    return <div className="h-64 flex items-center justify-center text-muted-foreground">Sem dados</div>
  }

  const data = safeList.map((c: CandidatoProcessado) => ({
    name: `${c?.numero ?? ''} - ${c?.nomeUrna ?? ''}`,
    votos: c?.votos ?? 0,
    percentual: c?.percentual ?? 0,
    cor: c?.corPartido ?? '#666',
  }))

  return (
    <div className="w-full" style={{ height: Math.max(200, safeList.length * 48) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 80, left: 10, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={180}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'hsl(210, 20%, 70%)' }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'hsl(215, 25%, 12%)', border: '1px solid hsl(215, 20%, 20%)', borderRadius: 8, fontSize: 11 }}
            labelStyle={{ color: 'hsl(210, 20%, 90%)' }}
            formatter={(value: any) => [formatVotos(value), 'Votos']}
          />
          <Bar dataKey="votos" radius={[0, 4, 4, 0]} barSize={28}>
            {data.map((entry: any, index: number) => (
              <Cell key={index} fill={entry?.cor ?? '#666'} fillOpacity={0.85} />
            ))}
            <LabelList
              dataKey="percentual"
              position="right"
              formatter={(val: any) => `${(val ?? 0).toFixed(2)}%`}
              style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', fill: 'hsl(210, 20%, 70%)' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
