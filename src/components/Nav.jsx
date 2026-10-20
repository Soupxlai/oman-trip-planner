import { Plane, Map, Hotel, Wallet } from 'lucide-react'

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: Map },
  { id: 'itinerary', label: 'Itinerary', icon: Map },
  { id: 'flights', label: 'Flights', icon: Plane },
  { id: 'budget', label: 'Budget', icon: Wallet },
]

export default function Nav({ active, onSelect }) {
  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-1 h-14">
        <span className="text-amber-700 font-bold text-lg mr-4 shrink-0">🕌 Oman 2026</span>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              active === id
                ? 'bg-amber-100 text-amber-800'
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}
