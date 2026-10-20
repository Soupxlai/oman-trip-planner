import { Box, Card, CardContent, Grid, Typography, LinearProgress, Divider } from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart'
import { tripMeta, budget } from '../data/tripData'

const COLORS = ['#b45309','#0891b2','#16a34a','#9333ea','#dc2626','#ea580c','#0284c7','#84cc16']

function countdown() {
  const dep = new Date(tripMeta.departureDate)
  const now = new Date()
  return Math.max(0, Math.ceil((dep - now) / (1000 * 60 * 60 * 24)))
}

export default function Dashboard() {
  const days = countdown()

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', px: 3, py: 4 }}>
      {/* Hero banner */}
      <Box sx={{
        borderRadius: 3, p: 4, mb: 3,
        background: 'linear-gradient(135deg, #b45309 0%, #ea580c 100%)',
        color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2,
      }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.8)', letterSpacing: 2 }}>Family Trip</Typography>
          <Typography variant="h3" fontWeight={800}>Oman 🇴🇲</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', mt: 0.5 }}>{tripMeta.dates} · Ken & Sue</Typography>
        </Box>
        <Box sx={{ textAlign: 'center', bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2, px: 4, py: 2 }}>
          <Typography variant="h2" fontWeight={800}>{days}</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>
            {days > 0 ? 'days to go' : "It's time!"}
          </Typography>
        </Box>
      </Box>

      {/* Stat cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
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

      <Grid container spacing={3}>
        {/* Pie chart */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Budget Breakdown</Typography>
              <PieChart
                series={[{
                  data: budget.categories.map((c, i) => ({ id: i, value: c.hkd, label: c.name, color: COLORS[i] })),
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  innerRadius: 40,
                }]}
                height={240}
                slotProps={{ legend: { hidden: true } }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Per-person + legend */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Per-Person Split</Typography>
              {Object.entries(budget.perPerson).map(([person, { hkd }], i) => (
                <Box key={person} mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" fontWeight={500}>{person}</Typography>
                    <Typography variant="body2" color="text.secondary">HKD {hkd.toLocaleString()}</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(hkd / budget.total.hkd) * 100}
                    sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: COLORS[i], borderRadius: 4 } }}
                  />
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom color="text.secondary">Categories</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75 }}>
                {budget.categories.map(({ name, pct }, i) => (
                  <Box key={name} display="flex" alignItems="center" gap={1}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS[i], flexShrink: 0 }} />
                    <Typography variant="caption" noWrap sx={{ flex: 1 }}>{name}</Typography>
                    <Typography variant="caption" color="text.secondary">{pct}%</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
