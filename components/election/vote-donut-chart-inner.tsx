'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import type { CandidatoProcessado } from '@/lib/types'
import { formatVotos } from '@/lib/format'

interface Props {
  candidatos: CandidatoProcessado[]
}

export default function VoteDonutChartInner({ candidatos }: Props) {
  const safeList = (candidatos ?? []).slice(0, 8)

  if (safeList.length === 0) {
    return <div className="h-64 flex items-center justify-center text-muted-foreground">Sem dados</div>
  }

  const data = safeList.map((c: CandidatoProcessado) => ({
    name: `${c?.numero ?? ''} ${c?.nomeUrna ?? ''}`,
    value: c?.votos ?? 0,
    cor: c?.corPartido ?? '#666',
  }))

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry: any, index: number) => (
              <Cell key={index} fill={entry?.cor ?? '#666'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: 'hsl(215, 25%, 12%)', border: '1px solid hsl(215, 20%, 20%)', borderRadius: 8, fontSize: 11 }}
            formatter={(value: any) => [formatVotos(value), 'Votos']}
          />
          <Legend
            verticalAlign="top"
            wrapperStyle={{ fontSize: 11 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
