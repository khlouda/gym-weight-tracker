import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

/**
 * Line chart showing max weight logged per day over time.
 *
 * Props:
 *   logs — array of log documents from getExerciseLogs()
 */
export function ProgressChart({ logs }) {
  // Group by date, keep the max weight per session
  const byDate = logs.reduce((acc, log) => {
    if (!acc[log.date] || log.weight > acc[log.date].weight) {
      acc[log.date] = { date: log.date, weight: log.weight, reps: log.reps }
    }
    return acc
  }, {})

  const chartData = Object.values(byDate)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(d => ({
      ...d,
      // Short label: "Mar 15"
      label: new Date(d.date + 'T12:00:00').toLocaleDateString('en', {
        month: 'short',
        day: 'numeric',
      }),
    }))

  if (chartData.length < 2) {
    return (
      <div className="h-40 flex items-center justify-center">
        <p className="text-white/25 text-sm text-center">
          Log at least 2 sessions to see your progress chart
        </p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.05)"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          stroke="transparent"
          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontFamily: 'Barlow' }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          stroke="transparent"
          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontFamily: 'Barlow' }}
          tickLine={false}
          domain={['auto', 'auto']}
          tickFormatter={v => `${v}kg`}
        />
        <Tooltip
          contentStyle={{
            background: '#17162a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontFamily: 'Barlow',
            fontSize: 13,
            color: '#e8e6f0',
          }}
          formatter={(value) => [`${value} kg`, 'Weight']}
          labelStyle={{ color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}
          cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }}
        />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="#634DB3"
          strokeWidth={2.5}
          dot={{ fill: '#634DB3', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#7761d0', strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
