import { Box, Card, CardContent, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress, Paper } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'
import { budget } from '../data/tripData'

const COLORS = ['#b45309','#0891b2','#16a34a','#9333ea','#dc2626','#ea580c','#0284c7','#84cc16']

export default function Budget() {
  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', px: 3, py: 4 }}>
      <Typography variant="h4" gutterBottom>Budget</Typography>

      {/* Summary cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#fffbeb', border: '1px solid #fde68a' }}>
            <CardContent>
              <Typography variant="caption" color="#92400e" textTransform="uppercase" fontWeight={600}>Grand Total</Typography>
              <Typography variant="h4" fontWeight={800} color="primary.main">HKD {budget.total.hkd.toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">OMR {budget.total.omr.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {Object.entries(budget.perPerson).map(([p, { hkd }]) => (
          <Grid item xs={6} md={2.67} key={p}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary" textTransform="uppercase">{p}</Typography>
                <Typography variant="h5" fontWeight={700} mt={0.5}>HKD {hkd.toLocaleString()}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {((hkd / budget.total.hkd) * 100).toFixed(1)}% of total
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Bar chart */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Spending by Category (HKD)</Typography>
          <BarChart
            xAxis={[{ scaleType: 'band', data: budget.categories.map(c => c.name), tickLabelStyle: { fontSize: 11 }, tickLabelInterval: () => true }]}
            series={[{ data: budget.categories.map(c => c.hkd), label: 'HKD', color: '#b45309' }]}
            height={280}
            margin={{ bottom: 80 }}
            borderRadius={6}
          />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent sx={{ p: '0 !important' }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell><Typography variant="caption" fontWeight={600} textTransform="uppercase">Category</Typography></TableCell>
                  <TableCell align="right"><Typography variant="caption" fontWeight={600} textTransform="uppercase">HKD</Typography></TableCell>
                  <TableCell align="right"><Typography variant="caption" fontWeight={600} textTransform="uppercase">OMR</Typography></TableCell>
                  <TableCell><Typography variant="caption" fontWeight={600} textTransform="uppercase">Share</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {budget.categories.map(({ name, hkd, omr, pct }, i) => (
                  <TableRow key={name} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS[i], flexShrink: 0 }} />
                        <Typography variant="body2">{name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right"><Typography variant="body2" fontWeight={500}>{hkd.toLocaleString()}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2" color="text.secondary">{omr}</Typography></TableCell>
                    <TableCell sx={{ minWidth: 140 }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <LinearProgress
                          variant="determinate"
                          value={pct}
                          sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: COLORS[i] } }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 32 }}>{pct}%</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell><Typography variant="body2" fontWeight={700}>Total</Typography></TableCell>
                  <TableCell align="right"><Typography variant="body2" fontWeight={700}>{budget.total.hkd.toLocaleString()}</Typography></TableCell>
                  <TableCell align="right"><Typography variant="body2" fontWeight={700}>{budget.total.omr}</Typography></TableCell>
                  <TableCell><Typography variant="caption" color="text.secondary">100%</Typography></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  )
}
