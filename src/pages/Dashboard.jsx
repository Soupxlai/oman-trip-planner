import { useState } from 'react'
import {
  Box, Card, CardContent, Chip, Grid, Typography,
  Stack, Divider, Alert,
} from '@mui/material'
import { Plane, PlaneTakeoff, PlaneLanding, Hotel, Clock, Wallet } from 'lucide-react'
import { tripMeta, budget, flights, itinerary, hotels } from '../data/tripData'

// ── helpers ──────────────────────────────────────────────────────────────────

function countdown() {
  const dep = new Date(tripMeta.departureDate)
  const now = new Date()
  return Math.max(0, Math.ceil((dep - now) / (1000 * 60 * 60 * 24)))
}

function fmt(t) {
  if (!t || t === '/') return '–'
  const s = t.toString().padStart(4, '0')
  return `${s.slice(0, 2)}:${s.slice(2)}`
}

const days = [...new Set(itinerary.map(e => e.date))]

const hotelByDate = Object.fromEntries(
  hotels.map(h => [h.nightOf.replace(' Nov', ' Nov 2026'), h])
)

// Flights that depart on each date
const flightsByDate = flights.reduce((acc, f) => {
  const match = f.outbound.match(/\((\d+ NOV)\)/)
  if (match) {
    const key = match[1].replace(' NOV', ' Nov 2026')
    if (!acc[key]) acc[key] = []
    acc[key].push(f)
  }
  return acc
}, {})

// Day cost = sum of itinerary items for that date
function dayCost(date) {
  return itinerary.filter(e => e.date === date).reduce((s, e) => s + (e.hkd || 0), 0)
}

// ── sub-components ────────────────────────────────────────────────────────────

function FlightCard({ f }) {
  return (
    <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2, mt: 1 }}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Plane size={14} color="#b45309" />
        <Typography variant="caption" fontWeight={600} color="primary.main" textTransform="uppercase">
          {f.airline}
        </Typography>
        <Chip label={f.cabinClass} size="small" variant="outlined" color="info" sx={{ height: 18, fontSize: 11 }} />
        <Chip label={f.person} size="small" variant="outlined" sx={{ height: 18, fontSize: 11 }} />
      </Box>
      <Grid container spacing={1.5}>
        <Grid item xs={12} sm={f.inbound && f.inbound !== '/' ? 6 : 12}>
          <Box sx={{ bgcolor: 'white', borderRadius: 1.5, p: 1.5, border: '1px solid', borderColor: 'divider' }}>
            <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
              <PlaneTakeoff size={12} color="#b45309" />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Outbound</Typography>
            </Box>
            <Typography variant="body2" fontWeight={600}>{f.outbound}</Typography>
            <Typography variant="caption" color="text.secondary">{f.outboundTime}</Typography>
          </Box>
        </Grid>
        {f.inbound && f.inbound !== '/' && (
          <Grid item xs={12} sm={6}>
            <Box sx={{ bgcolor: 'white', borderRadius: 1.5, p: 1.5, border: '1px solid', borderColor: 'divider' }}>
              <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                <PlaneLanding size={12} color="#0891b2" />
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Inbound</Typography>
              </Box>
              <Typography variant="body2" fontWeight={600}>{f.inbound}</Typography>
              <Typography variant="caption" color="text.secondary">{f.inboundTime}</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
      {f.totalHKD > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          Cost: <strong>HKD {f.totalHKD.toLocaleString()}</strong>
        </Typography>
      )}
      {f.category === 'Company-covered' && (
        <Chip label="Company covered ✓" color="success" size="small" sx={{ mt: 0.5 }} />
      )}
    </Box>
  )
}

function DaySection({ date }) {
  const events = itinerary.filter(e => e.date === date)
  const hotel = hotelByDate[date]
  const dayFlights = flightsByDate[date] || []
  const cost = dayCost(date)

  return (
    <Box>
      {/* Hotel banner */}
      {hotel && (
        <Alert
          icon={<Hotel size={16} />}
          severity="info"
          sx={{ mb: 1.5, borderRadius: 2, bgcolor: '#fffbeb', color: '#92400e', border: '1px solid #fde68a', '& .MuiAlert-icon': { color: '#b45309' } }}
        >
          <Typography variant="body2" fontWeight={600}>{hotel.hotel}</Typography>
          {hotel.hkdPerNight > 0 && (
            <Typography variant="caption">HKD {hotel.hkdPerNight.toLocaleString()} / night · OMR {hotel.omrPerNight}</Typography>
          )}
        </Alert>
      )}

      {/* Flights for this day */}
      {dayFlights.map((f, i) => <FlightCard key={i} f={f} />)}

      {/* Activity timeline */}
      <Stack spacing={1} sx={{ mt: dayFlights.length ? 1.5 : 0 }}>
        {events.map((e, i) => (
          <Card key={i} variant="outlined">
            <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', py: '10px !important', px: 2 }}>
              <Box sx={{ minWidth: 72, textAlign: 'center' }}>
                <Box display="flex" alignItems="center" gap={0.5} justifyContent="center">
                  <Clock size={11} color="#9ca3af" />
                  <Typography variant="caption" color="text.secondary">{fmt(e.timeStart)}</Typography>
                </Box>
                {e.timeFinish && e.timeFinish !== '/' && (
                  <>
                    <Divider sx={{ my: 0.5, borderStyle: 'dashed' }} />
                    <Typography variant="caption" color="text.disabled">{fmt(e.timeFinish)}</Typography>
                  </>
                )}
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box flex={1}>
                <Typography variant="body2" fontWeight={500}>{e.activity}</Typography>
                {e.hkd > 0 && (
                  <Typography variant="caption" color="text.secondary">
                    HKD {e.hkd.toLocaleString()}{e.omr > 0 ? ` · OMR ${e.omr}` : ''}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Day cost summary */}
      {cost > 0 && (
        <Box display="flex" alignItems="center" gap={1} mt={1.5} justifyContent="flex-end">
          <Wallet size={13} color="#6b7280" />
          <Typography variant="caption" color="text.secondary">
            Day total: <strong>HKD {cost.toLocaleString()}</strong>
          </Typography>
        </Box>
      )}
    </Box>
  )
}

// ── main page ─────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [activeDay, setActiveDay] = useState(days[0])
  const days_count = countdown()

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', px: 3, py: 4 }}>

      {/* Hero */}
      <Box sx={{
        borderRadius: 3, p: { xs: 3, sm: 4 }, mb: 3,
        background: 'linear-gradient(135deg, #b45309 0%, #ea580c 100%)',
        color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2,
      }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.8)', letterSpacing: 2 }}>Family Trip</Typography>
          <Typography variant="h3" fontWeight={800}>Oman 🇴🇲</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', mt: 0.5 }}>{tripMeta.dates} · Ken & Sue</Typography>
        </Box>
        <Box sx={{ textAlign: 'center', bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2, px: 4, py: 2 }}>
          <Typography variant="h2" fontWeight={800}>{days_count}</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>
            {days_count > 0 ? 'days to go' : "It's time!"}
          </Typography>
        </Box>
      </Box>

      {/* Quick stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Total Budget', value: `HKD ${budget.total.hkd.toLocaleString()}` },
          { label: 'In Omani Rial', value: `OMR ${budget.total.omr.toLocaleString()}` },
          { label: 'Duration', value: '7 nights · 8 days' },
          { label: 'Travelers', value: 'Ken + Sue' },
        ].map(({ label, value }) => (
          <Grid item xs={6} md={3} key={label}>
            <Card>
              <CardContent sx={{ pb: '12px !important' }}>
                <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={1}>{label}</Typography>
                <Typography variant="h6" fontWeight={700} mt={0.5}>{value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Itinerary */}
      <Typography variant="h5" fontWeight={700} mb={2}>Itinerary</Typography>

      {/* Day selector */}
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
        {days.map(d => (
          <Chip
            key={d}
            label={d.replace(' 2026', '')}
            onClick={() => setActiveDay(d)}
            color={activeDay === d ? 'primary' : 'default'}
            variant={activeDay === d ? 'filled' : 'outlined'}
            sx={{ fontWeight: 500 }}
          />
        ))}
      </Stack>

      <DaySection date={activeDay} />

    </Box>
  )
}
