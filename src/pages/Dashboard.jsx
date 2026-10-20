import { useState } from 'react'
import { Card, Col, Row, Tag, Typography, Alert, Divider, Space, Badge } from 'antd'
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

// Cover images per day (Unsplash — Oman locations)
const dayImages = {
  '6 Nov 2026':  'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&q=80', // Muscat airport/city
  '7 Nov 2026':  'https://images.unsplash.com/photo-1697292611556-c69c86fa5e80?w=800&q=80', // dolphins Oman
  '8 Nov 2026':  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80', // snorkelling
  '9 Nov 2026':  'https://images.unsplash.com/photo-1568378780196-d20c8e72f08e?w=800&q=80', // Wadi Shab
  '10 Nov 2026': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', // mountain road
  '11 Nov 2026': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', // Jebel Akhdar mountains
  '12 Nov 2026': 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=80', // Nizwa fort
  '13 Nov 2026': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80', // airport departure
}

// Hotel images
const hotelImages = {
  'Novotel Muscat Airport':                    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  'Ras Al Jinz Turtle Reserve':                'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=800&q=80',
  'Hotel Indigo Jabal Akhdar Resort & Spa':    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
  'Aloft Muscat':                              'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
}

const cabinColorMap = { Economy: 'blue', 'Premium Economy': 'purple' }
const categoryColorMap = { 'Self-funded': 'default', 'Company-covered': 'green', 'Asia Miles / Self-funded': 'orange' }

// ── Flight card ───────────────────────────────────────────────────────────────

function FlightCard({ f }) {
  return (
    <Card
      size="small"
      cover={
        <div style={{ position: 'relative', height: 90, overflow: 'hidden', borderRadius: '10px 10px 0 0' }}>
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"
            alt="flight"
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)' }}
          />
          <div style={{ position: 'absolute', inset: 0, padding: '12px 16px', display: 'flex', alignItems: 'flex-end' }}>
            <Space>
              <Plane size={14} color="#f59e0b" />
              <Text strong style={{ color: '#fff', fontSize: 14 }}>{f.airline}</Text>
              <Tag color={cabinColorMap[f.cabinClass] || 'default'} style={{ margin: 0 }}>{f.cabinClass}</Tag>
              <Tag style={{ margin: 0 }}>{f.person}</Tag>
              <Tag color={categoryColorMap[f.category] || 'default'} style={{ margin: 0 }}>{f.category}</Tag>
            </Space>
          </div>
        </div>
      }
      style={{ marginBottom: 12, borderColor: '#303030' }}
      bodyStyle={{ padding: '12px 16px' }}
    >
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
            <div style={{ background: '#141414', border: '1px solid #303030', borderRadius: 8, padding: '10px 12px' }}>
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
      <div style={{ marginTop: 10 }}>
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
  const imgSrc = dayImages[date]

  return (
    <div>
      {/* Hotel card with cover image */}
      {hotel && (
        <Card
          cover={
            <div style={{ position: 'relative', height: 140, overflow: 'hidden', borderRadius: '10px 10px 0 0' }}>
              <img
                src={hotelImages[hotel.hotel] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'}
                alt={hotel.hotel}
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5)' }}
              />
              <div style={{ position: 'absolute', inset: 0, padding: '12px 16px', display: 'flex', alignItems: 'flex-end' }}>
                <div>
                  <Space>
                    <Hotel size={14} color="#f59e0b" />
                    <Text strong style={{ color: '#fff', fontSize: 14 }}>{hotel.hotel}</Text>
                  </Space>
                  {hotel.hkdPerNight > 0 && (
                    <div>
                      <Text style={{ color: '#fcd34d', fontSize: 12 }}>
                        HKD {hotel.hkdPerNight.toLocaleString()} / night · OMR {hotel.omrPerNight}
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            </div>
          }
          style={{ marginBottom: 12, borderColor: '#303030' }}
          bodyStyle={{ padding: 0, height: 0 }}
        />
      )}

      {/* Flight cards */}
      {dayFlights.map((f, i) => <FlightCard key={i} f={f} />)}

      {/* Activity timeline card with cover image */}
      <Card
        cover={
          imgSrc ? (
            <div style={{ position: 'relative', height: 120, overflow: 'hidden', borderRadius: '10px 10px 0 0' }}>
              <img
                src={imgSrc}
                alt={date}
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.45)' }}
              />
              <div style={{ position: 'absolute', inset: 0, padding: '12px 16px', display: 'flex', alignItems: 'flex-end' }}>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Activities · {date.replace(' 2026', '')}
                </Text>
              </div>
            </div>
          ) : null
        }
        style={{ marginBottom: 12, borderColor: '#303030' }}
        bodyStyle={{ padding: '12px 16px' }}
      >
        <div>
          {events.map((e, i) => (
            <div key={i}>
              <Row align="top" gutter={12} wrap={false} style={{ padding: '8px 0' }}>
                <Col style={{ minWidth: 72, textAlign: 'center' }}>
                  <Space size={3}>
                    <Clock size={11} color="#9ca3af" />
                    <Text type="secondary" style={{ fontSize: 11 }}>{fmt(e.timeStart)}</Text>
                  </Space>
                  {e.timeFinish && e.timeFinish !== '/' && (
                    <>
                      <Divider style={{ margin: '3px 0', borderStyle: 'dashed' }} />
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
              {i < events.length - 1 && <Divider style={{ margin: '0' }} />}
            </div>
          ))}
        </div>

        {cost > 0 && (
          <>
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6 }}>
              <Wallet size={13} color="#6b7280" />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Day total: <Text strong>HKD {cost.toLocaleString()}</Text>
              </Text>
            </div>
          </>
        )}
      </Card>
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
        borderRadius: 16, padding: '28px 32px', marginBottom: 24,
        background: 'linear-gradient(135deg, #b45309 0%, #ea580c 100%)',
        color: 'white',
      }}>
        {/* Top row: title + countdown */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
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

        {/* Stat pills inside banner */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: 'Total Budget', value: `HKD ${budget.total.hkd.toLocaleString()}` },
            { label: 'In Omani Rial', value: `OMR ${budget.total.omr.toLocaleString()}` },
            { label: 'Duration', value: '7 nights · 8 days' },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: '10px 16px', flex: '1 1 140px' }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Itinerary */}
      <Title level={4} style={{ marginBottom: 16 }}>Itinerary</Title>

      <Space wrap style={{ marginBottom: 20 }}>
        {days.map(d => (
          <Tag
            key={d}
            onClick={() => setActiveDay(d)}
            color={activeDay === d ? 'volcano' : 'default'}
            style={{
              cursor: 'pointer', fontWeight: 600, padding: '4px 12px',
              fontSize: 13, borderRadius: 20,
              border: activeDay === d ? 'none' : '1px solid #303030',
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
