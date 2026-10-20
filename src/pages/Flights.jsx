import { Box, Card, CardContent, Chip, Typography, Grid, Divider, Stack } from '@mui/material'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import FlightLandIcon from '@mui/icons-material/FlightLand'
import { flights } from '../data/tripData'

const cabinColors = { Economy: 'info', 'Premium Economy': 'secondary' }
const categoryColors = { 'Self-funded': 'default', 'Company-covered': 'success', 'Asia Miles / Self-funded': 'warning' }

export default function Flights() {
  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', px: 3, py: 4 }}>
      <Typography variant="h4" gutterBottom>Flights</Typography>
      <Stack spacing={2}>
        {flights.map((f, i) => (
          <Card key={i}>
            <CardContent>
              {/* Header */}
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1} mb={2}>
                <Box>
                  <Typography variant="h6">{f.airline}</Typography>
                  <Stack direction="row" spacing={1} mt={0.5}>
                    <Chip label={f.cabinClass} size="small" color={cabinColors[f.cabinClass] || 'default'} variant="outlined" />
                    <Chip label={f.person} size="small" variant="outlined" />
                    <Chip label={f.category} size="small" color={categoryColors[f.category] || 'default'} variant="filled" />
                  </Stack>
                </Box>
                {f.totalHKD > 0 ? (
                  <Typography variant="h6" color="primary.main" fontWeight={700}>
                    HKD {f.totalHKD.toLocaleString()}
                  </Typography>
                ) : f.category === 'Company-covered' ? (
                  <Chip label="Company covered ✓" color="success" />
                ) : (
                  <Chip label="Asia Miles" color="warning" />
                )}
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Route */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={f.inbound && f.inbound !== '/' ? 6 : 12}>
                  <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <FlightTakeoffIcon fontSize="small" color="primary" />
                      <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>Outbound</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={600}>{f.outbound}</Typography>
                    <Typography variant="body2" color="text.secondary">{f.outboundTime}</Typography>
                  </Box>
                </Grid>
                {f.inbound && f.inbound !== '/' && (
                  <Grid item xs={12} md={6}>
                    <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2 }}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <FlightLandIcon fontSize="small" color="secondary" />
                        <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>Inbound</Typography>
                      </Box>
                      <Typography variant="body1" fontWeight={600}>{f.inbound}</Typography>
                      <Typography variant="body2" color="text.secondary">{f.inboundTime}</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}
