import { useState } from 'react'
import { Box, Card, CardContent, Chip, Typography, Stack, Divider, Alert } from '@mui/material'
import HotelIcon from '@mui/icons-material/Hotel'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { itinerary, hotels } from '../data/tripData'

const hotelByDate = Object.fromEntries(
  hotels.map(h => [h.nightOf.replace(' Nov', ' Nov 2026'), h])
)
const days = [...new Set(itinerary.map(e => e.date))]

function fmt(t) {
  if (!t || t === '/') return '–'
  const s = t.toString().padStart(4, '0')
  return `${s.slice(0, 2)}:${s.slice(2)}`
}

export default function Itinerary() {
  const [activeDay, setActiveDay] = useState(days[0])
  const events = itinerary.filter(e => e.date === activeDay)
  const hotel = hotelByDate[activeDay]

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', px: 3, py: 4 }}>
      <Typography variant="h4" gutterBottom>Itinerary</Typography>

      {/* Day selector chips */}
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

      {/* Hotel for this night */}
      {hotel && (
        <Alert
          icon={<HotelIcon />}
          severity="info"
          sx={{ mb: 2, borderRadius: 2, bgcolor: '#fffbeb', color: '#92400e', border: '1px solid #fde68a', '& .MuiAlert-icon': { color: '#b45309' } }}
        >
          <Typography variant="body2" fontWeight={600}>{hotel.hotel}</Typography>
          {hotel.hkdPerNight > 0 && (
            <Typography variant="caption">
              HKD {hotel.hkdPerNight.toLocaleString()} / night · OMR {hotel.omrPerNight}
            </Typography>
          )}
        </Alert>
      )}

      {/* Timeline */}
      <Stack spacing={1.5}>
        {events.map((e, i) => (
          <Card key={i} variant="outlined">
            <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', py: '12px !important', px: 2 }}>
              {/* Time column */}
              <Box sx={{ minWidth: 80, textAlign: 'center' }}>
                <Box display="flex" alignItems="center" gap={0.5} justifyContent="center">
                  <AccessTimeIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
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

              {/* Content */}
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
    </Box>
  )
}
