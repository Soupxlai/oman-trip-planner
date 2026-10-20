import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { budget } from '../data/tripData'

const COLORS = ['#d97706','#0891b2','#16a34a','#9333ea','#dc2626','#ea580c','#0284c7','#84cc16']

export default function Budget() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-stone-800">Budget</h1>

      {/* Total cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 col-span-2 md:col-span-1">
          <p className="text-xs text-amber-600 uppercase tracking-wide">Grand Total</p>
          <p className="text-2xl font-bold text-amber-800 mt-1">HKD {budget.total.hkd.toLocaleString()}</p>
          <p className="text-sm text-amber-600">OMR {budget.total.omr.toLocaleString()}</p>
        </div>
        {Object.entries(budget.perPerson).map(([p, { hkd }]) => (
          <div key={p} className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-xs text-stone-400 uppercase tracking-wide">{p}</p>
            <p className="text-xl font-bold text-stone-800 mt-1">HKD {hkd.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-white border border-stone-200 rounded-xl p-6">
        <h2 className="font-semibold text-stone-700 mb-4">Spending by Category (HKD)</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={budget.categories} margin={{ top: 5, right: 10, left: 10, bottom: 60 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => `HKD ${v.toLocaleString()}`} />
            <Bar dataKey="hkd" radius={[4, 4, 0, 0]}>
              {budget.categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="text-left px-4 py-3 text-stone-500 font-medium">Category</th>
              <th className="text-right px-4 py-3 text-stone-500 font-medium">HKD</th>
              <th className="text-right px-4 py-3 text-stone-500 font-medium">OMR</th>
              <th className="text-right px-4 py-3 text-stone-500 font-medium">% of Total</th>
            </tr>
          </thead>
          <tbody>
            {budget.categories.map(({ name, hkd, omr, pct }, i) => (
              <tr key={name} className="border-b border-stone-100 last:border-0">
                <td className="px-4 py-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  {name}
                </td>
                <td className="px-4 py-3 text-right font-medium">{hkd.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-stone-500">{omr}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: COLORS[i] }} />
                    </div>
                    <span className="text-stone-500 w-8 text-right">{pct}%</span>
                  </div>
                </td>
              </tr>
            ))}
            <tr className="bg-stone-50 font-semibold">
              <td className="px-4 py-3">Total</td>
              <td className="px-4 py-3 text-right">{budget.total.hkd.toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-stone-500">{budget.total.omr}</td>
              <td className="px-4 py-3 text-right text-stone-500">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
