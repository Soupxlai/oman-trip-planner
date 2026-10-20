import { AppBar, Toolbar, Tabs, Tab, Typography, Box } from '@mui/material'
import FlightIcon from '@mui/icons-material/Flight'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import DashboardIcon from '@mui/icons-material/Dashboard'

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon fontSize="small" /> },
  { id: 'itinerary', label: 'Itinerary', icon: <CalendarMonthIcon fontSize="small" /> },
  { id: 'flights', label: 'Flights', icon: <FlightIcon fontSize="small" /> },
  { id: 'budget', label: 'Budget', icon: <AccountBalanceWalletIcon fontSize="small" /> },
]

export default function Nav({ active, onSelect }) {
  const value = tabs.findIndex(t => t.id === active)
  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800, mr: 2, fontSize: '1.1rem' }}>
          🕌 Oman 2026
        </Typography>
        <Tabs value={value} onChange={(_, i) => onSelect(tabs[i].id)} textColor="primary" indicatorColor="primary">
          {tabs.map(({ label, icon }) => (
            <Tab key={label} label={label} icon={icon} iconPosition="start" sx={{ minHeight: 56, textTransform: 'none', fontWeight: 500, fontSize: '0.875rem' }} />
          ))}
        </Tabs>
      </Toolbar>
    </AppBar>
  )
}
