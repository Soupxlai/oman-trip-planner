import { AppBar, Toolbar, Tabs, Tab, Typography } from '@mui/material'
import { LayoutDashboard, Calendar, Plane, Wallet } from 'lucide-react'

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'itinerary', label: 'Itinerary', icon: Calendar },
  { id: 'flights', label: 'Flights', icon: Plane },
  { id: 'budget', label: 'Budget', icon: Wallet },
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
          {tabs.map(({ label, icon: Icon }) => (
            <Tab
              key={label}
              label={label}
              icon={<Icon size={15} />}
              iconPosition="start"
              sx={{ minHeight: 56, textTransform: 'none', fontWeight: 500, fontSize: '0.875rem' }}
            />
          ))}
        </Tabs>
      </Toolbar>
    </AppBar>
  )
}
