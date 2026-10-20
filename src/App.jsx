import { useState } from 'react'
import Nav from './components/Nav'
import Dashboard from './pages/Dashboard'
import Itinerary from './pages/Itinerary'
import Flights from './pages/Flights'
import Budget from './pages/Budget'

export default function App() {
  const [page, setPage] = useState('dashboard')

  return (
    <div className="min-h-screen bg-stone-50">
      <Nav active={page} onSelect={setPage} />
      {page === 'dashboard' && <Dashboard />}
      {page === 'itinerary' && <Itinerary />}
      {page === 'flights' && <Flights />}
      {page === 'budget' && <Budget />}
    </div>
  )
}
