import { useState } from 'react'
import { Card, Col, Row, Tag, Typography, Alert, Divider, Space } from 'antd'
import { Plane, PlaneTakeoff, PlaneLanding, Hotel, Clock, Wallet } from 'lucide-react'
import { tripMeta, budget, flights, itinerary, hotels } from '../data/tripData'

const { Title, Text } = Typography

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

const flightsByDate = flights.reduce((acc, f) => {
  const match = f.outbound.match(/\((\d+ NOV)\)/)
  if (match) {
    const key = match[1].replace(' NOV', ' Nov 2026')
    if (!acc[key]) acc[key] = []
    acc[key].push(f)
  }
  return acc
}, {})

function dayCost(date) {
  return itinerary.filter(e => e.date === date).reduce((s, e) => s + (e.hkd || 0), 0)
}

const cabinColorMap = { Economy: 'blue', 'Premium Economy': 'purple' }
const categoryColorMap = { 'Self-funded': 'default', 'Company-covered': 'green', 'Asia Miles / Self-funded': 'orange' }

// ── Flight card ───────────────────────────────────────────────────────────────

function FlightCard({ f }) {
  return (
    <Card
      size="small"
      style={{ marginBottom: 8, background: '#1f1f1f', borderColor: '#303030' }}
      bodyStyle={{ padding: '12px 16px' }}
    >
      <Space align="center" style={{ marginBottom: 10 }}>
        <Plane size={14} color="#b45309" />
        <Text strong style={{ fontSize: 13 }}>{f.airline}</Text>
        <Tag color={cabinColorMap[f.cabinClass] || 'default'}>{f.cabinClass}</Tag>
        <Tag>{f.person}</Tag>
        <Tag color={categoryColorMap[f.category] || 'default'}>{f.category}</Tag>
      </Space>

      <Row gutter={12}>
        <Col xs={24} sm={f.inbound && f.inbound !== '/' ? 12 : 24}>
          <div style={{ background: '#141414', border: '1px solid #303030', borderRadius: 8, padding: '10px 12px' }}>
            <Space style={{ marginBottom: 4 }}>
              <PlaneTakeoff size={12} color="#f59e0b" />
              <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 600 }}>Outbound</Text>
            </Space>
            <div><Text strong style={{ fontSize: 13 }}>{f.outbound}</Text></div>
            <Text type="secondary" style={{ fontSize: 12 }}>{f.outboundTime}</Text>
          </div>
        </Col>
        {f.inbound && f.inbound !== '/' && (
          <Col xs={24} sm={12}>
            <div style={{ background: '#141414', border: '1px solid #303030', borderRadius: 8, padding: '10px 12px', marginTop: window.innerWidth < 576 ? 8 : 0 }}>
              <Space style={{ marginBottom: 4 }}>
                <PlaneLanding size={12} color="#0891b2" />
                <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 600 }}>Inbound</Text>
              </Space>
              <div><Text strong style={{ fontSize: 13 }}>{f.inbound}</Text></div>
              <Text type="secondary" style={{ fontSize: 12 }}>{f.inboundTime}</Text>
            </div>
          </Col>
        )}
      </Row>

      <div style={{ marginTop: 8 }}>
        {f.totalHKD > 0 ? (
          <Text type="secondary" style={{ fontSize: 12 }}>Cost: <Text strong>HKD {f.totalHKD.toLocaleString()}</Text></Text>
        ) : f.category === 'Company-covered' ? (
          <Tag color="green">Company covered ✓</Tag>
        ) : (
          <Tag color="orange">Asia Miles</Tag>
        )}
      </div>
    </Card>
  )
}

// ── Day section ───────────────────────────────────────────────────────────────

function DaySection({ date }) {
  const events = itinerary.filter(e => e.date === date)
  const hotel = hotelByDate[date]
  const dayFlights = flightsByDate[date] || []
  const cost = dayCost(date)

  return (
    <div>
      {hotel && (
        <Alert
          icon={<Hotel size={16} />}
          showIcon
          style={{ marginBottom: 12, background: '#2a1f00', border: '1px solid #78350f', borderRadius: 10 }}
          message={<Text strong style={{ color: '#fde68a' }}>{hotel.hotel}</Text>}
          description={hotel.hkdPerNight > 0
            ? <Text style={{ color: '#fcd34d', fontSize: 12 }}>HKD {hotel.hkdPerNight.toLocaleString()} / night · OMR {hotel.omrPerNight}</Text>
            : null}
        />
      )}

      {dayFlights.map((f, i) => <FlightCard key={i} f={f} />)}

      <div style={{ marginTop: dayFlights.length ? 12 : 0 }}>
        {events.map((e, i) => (
          <Card
            key={i}
            size="small"
            variant="outlined"
            style={{ marginBottom: 8, borderColor: '#e5e7eb' }}
            bodyStyle={{ padding: '10px 16px' }}
          >
            <Row align="top" gutter={12} wrap={false}>
              <Col style={{ minWidth: 76, textAlign: 'center' }}>
                <Space size={3}>
                  <Clock size={11} color="#9ca3af" />
                  <Text type="secondary" style={{ fontSize: 11 }}>{fmt(e.timeStart)}</Text>
                </Space>
                {e.timeFinish && e.timeFinish !== '/' && (
                  <>
                    <Divider style={{ margin: '4px 0', borderStyle: 'dashed' }} />
                    <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>{fmt(e.timeFinish)}</Text>
                  </>
                )}
              </Col>
              <Col flex="none">
                <Divider type="vertical" style={{ height: '100%', margin: '0 4px' }} />
              </Col>
              <Col flex="auto">
                <Text style={{ fontSize: 13, fontWeight: 500 }}>{e.activity}</Text>
                {e.hkd > 0 && (
                  <div>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      HKD {e.hkd.toLocaleString()}{e.omr > 0 ? ` · OMR ${e.omr}` : ''}
                    </Text>
                  </div>
                )}
              </Col>
            </Row>
          </Card>
        ))}
      </div>

      {cost > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, marginTop: 8 }}>
          <Wallet size={13} color="#6b7280" />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Day total: <Text strong>HKD {cost.toLocaleString()}</Text>
          </Text>
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [activeDay, setActiveDay] = useState(days[0])
  const daysLeft = countdown()

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>

      {/* Hero */}
      <div style={{
        borderRadius: 16, padding: '32px 36px', marginBottom: 24,
        background: 'linear-gradient(135deg, #b45309 0%, #ea580c 100%)',
        color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}>Family Trip</div>
          <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.1 }}>Oman 🇴🇲</div>
          <div style={{ color: 'rgba(255,255,255,0.85)', marginTop: 6 }}>{tripMeta.dates} · Ken & Sue</div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: '16px 32px' }}>
          <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1 }}>{daysLeft}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>
            {daysLeft > 0 ? 'days to go' : "It's time!"}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {[
          { label: 'Total Budget', value: `HKD ${budget.total.hkd.toLocaleString()}` },
          { label: 'In Omani Rial', value: `OMR ${budget.total.omr.toLocaleString()}` },
          { label: 'Duration', value: '7 nights · 8 days' },
          { label: 'Travelers', value: 'Ken + Sue' },
        ].map(({ label, value }) => (
          <Col xs={12} md={6} key={label}>
            <Card size="small" bodyStyle={{ padding: '14px 16px' }}>
              <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</Text>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>{value}</div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Itinerary */}
      <Title level={4} style={{ marginBottom: 16 }}>Itinerary</Title>

      {/* Day chips */}
      <Space wrap style={{ marginBottom: 20 }}>
        {days.map(d => (
          <Tag
            key={d}
            onClick={() => setActiveDay(d)}
            color={activeDay === d ? 'volcano' : 'default'}
            style={{
              cursor: 'pointer', fontWeight: 600, padding: '4px 12px',
              fontSize: 13, borderRadius: 20,
              border: activeDay === d ? 'none' : '1px solid #d1d5db',
            }}
          >
            {d.replace(' 2026', '')}
          </Tag>
        ))}
      </Space>

      <DaySection date={activeDay} />
    </div>
  )
}
