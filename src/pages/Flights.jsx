import { flights } from '../data/tripData'
import { Plane } from 'lucide-react'

const cabinColor = { Economy: 'bg-blue-100 text-blue-700', 'Premium Economy': 'bg-purple-100 text-purple-700' }

export default function Flights() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Flights</h1>
      <div className="space-y-4">
        {flights.map((f, i) => (
          <div key={i} className="bg-white border border-stone-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Plane size={18} className="text-amber-500" />
                <span className="font-semibold text-stone-800">{f.airline}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cabinColor[f.cabinClass] || 'bg-stone-100 text-stone-600'}`}>
                  {f.cabinClass}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-stone-500">👤 {f.person}</span>
                <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{f.category}</span>
              </div>
            </div>

            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="bg-stone-50 rounded-lg p-3">
                <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Outbound</p>
                <p className="font-medium text-stone-800">{f.outbound}</p>
                <p className="text-sm text-stone-500">{f.outboundTime}</p>
              </div>
              {f.inbound && f.inbound !== '/' && (
                <div className="bg-stone-50 rounded-lg p-3">
                  <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Inbound</p>
                  <p className="font-medium text-stone-800">{f.inbound}</p>
                  <p className="text-sm text-stone-500">{f.inboundTime}</p>
                </div>
              )}
            </div>

            {f.totalHKD > 0 && (
              <p className="mt-3 text-sm font-medium text-stone-600">
                Cost: <span className="text-amber-700">HKD {f.totalHKD.toLocaleString()}</span>
              </p>
            )}
            {f.totalHKD === 0 && f.category === 'Company-covered' && (
              <p className="mt-3 text-sm text-green-600 font-medium">✓ Company covered</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
