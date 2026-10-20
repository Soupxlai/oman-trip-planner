import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { tripMeta, budget } from '../data/tripData'

const COLORS = ['#d97706','#0891b2','#16a34a','#9333ea','#dc2626','#ea580c','#0284c7','#84cc16']

function countdown() {
  const dep = new Date(tripMeta.departureDate)
  const now = new Date()
  const diff = Math.ceil((dep - now) / (1000 * 60 * 60 * 24))
  return diff
}

export default function Dashboard() {
  const days = countdown()

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-amber-100 text-sm font-medium uppercase tracking-wider mb-1">Family Trip</p>
          <h1 className="text-4xl font-bold">Oman 🇴🇲</h1>
          <p className="text-amber-100 mt-1">{tripMeta.dates} · Ken & Sue</p>
        </div>
        <div className="text-center bg-white/20 rounded-xl px-6 py-4">
          <p className="text-5xl font-bold">{days > 0 ? days : 0}</p>
          <p className="text-amber-100 text-sm mt-1">{days > 0 ? 'days to go' : 'Trip is here!'}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Budget', value: `HKD ${budget.total.hkd.toLocaleString()}` },
          { label: 'Nights', value: '7 nights' },
          { label: 'Travelers', value: 'Ken + Sue' },
          { label: 'In OMR', value: `OMR ${budget.total.omr.toLocaleString()}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-stone-200 p-4">
            <p className="text-stone-500 text-xs uppercase tracking-wide">{label}</p>
            <p className="text-stone-900 font-bold text-lg mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Budget chart + breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-semibold text-stone-700 mb-4">Budget by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={budget.categories} dataKey="hkd" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={({ name, pct }) => `${pct}%`} labelLine={false}>
                {budget.categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `HKD ${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-semibold text-stone-700 mb-4">Per-Person Split</h2>
          <div className="space-y-3">
            {Object.entries(budget.perPerson).map(([person, { hkd }], i) => (
              <div key={person}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stone-600">{person}</span>
                  <span className="font-medium">HKD {hkd.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(hkd / budget.total.hkd) * 100}%`, backgroundColor: COLORS[i] }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <h3 className="font-semibold text-stone-700 text-sm">Category Breakdown</h3>
            {budget.categories.map(({ name, hkd, pct }, i) => (
              <div key={name} className="flex items-center gap-2 text-sm">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i] }} />
                <span className="flex-1 text-stone-600">{name}</span>
                <span className="text-stone-500 text-xs">{pct}%</span>
                <span className="font-medium w-24 text-right">HKD {hkd.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
