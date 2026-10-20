import { useState } from 'react'
import { itinerary, hotels } from '../data/tripData'

const hotelByDate = Object.fromEntries(hotels.map(h => [h.nightOf.replace(' Nov', ' Nov 2026'), h]))

const days = [...new Set(itinerary.map(e => e.date))]

function fmt(t) {
  if (!t || t === '/') return '–'
  const s = t.toString().padStart(4, '0')
  return `${s.slice(0, 2)}:${s.slice(2)}`
}

export default function Itinerary() {
  const [openDay, setOpenDay] = useState(days[0])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Itinerary</h1>

      <div className="flex gap-2 flex-wrap mb-6">
        {days.map(d => (
          <button
            key={d}
            onClick={() => setOpenDay(d)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              openDay === d ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {d.replace(' 2026', '')}
          </button>
        ))}
      </div>

      {days.map(day => {
        if (day !== openDay) return null
        const events = itinerary.filter(e => e.date === day)
        const hotel = hotelByDate[day]
        return (
          <div key={day} className="space-y-3">
            {hotel && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-xl">🏨</span>
                <div>
                  <p className="text-sm font-semibold text-amber-800">{hotel.hotel}</p>
                  {hotel.hkdPerNight > 0 && (
                    <p className="text-xs text-amber-600">HKD {hotel.hkdPerNight.toLocaleString()} / night · OMR {hotel.omrPerNight}</p>
                  )}
                </div>
              </div>
            )}
            {events.map((e, i) => (
              <div key={i} className="bg-white border border-stone-200 rounded-xl p-4 flex gap-4">
                <div className="text-center w-16 shrink-0">
                  <p className="text-xs text-stone-400">{fmt(e.timeStart)}</p>
                  {e.timeFinish && e.timeFinish !== '/' && (
                    <>
                      <div className="w-px h-4 bg-stone-200 mx-auto my-1" />
                      <p className="text-xs text-stone-400">{fmt(e.timeFinish)}</p>
                    </>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-stone-800">{e.activity}</p>
                  {e.hkd > 0 && (
                    <p className="text-xs text-stone-500 mt-1">
                      HKD {e.hkd.toLocaleString()} {e.omr > 0 ? `· OMR ${e.omr}` : ''}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
