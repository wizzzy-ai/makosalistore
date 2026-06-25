import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import {
  FiDollarSign,
  FiDownload,
  FiPackage,
  FiShoppingCart,
  FiTrendingDown,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi'
import AdminLayout from '../../components/AdminLayout'
import { formatCurrency } from '../../utils/formatCurrency'
import './Analytics.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
)

const Analytics = ({ history }) => {
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const [timeRange, setTimeRange] = useState('30d')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [stats, setStats] = useState({
    revenue: 0,
    revenueGrowth: null,
    users: 0,
    usersGrowth: null,
    orders: 0,
    ordersGrowth: null,
    products: 0,
    productsGrowth: null,
    monthlyRevenue: [],
    topProducts: [],
  })

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
    }
  }, [userInfo, history])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = userInfo?.token
        if (!token) {
          setLoadError('Not authenticated.')
          setLoading(false)
          return
        }
        const config = { headers: { Authorization: `Bearer ${token}` } }
        const { data } = await axios.get('/api/admin/statistics', config)
        setStats({
          revenue: data.revenue ?? 0,
          revenueGrowth: data.revenueGrowth ?? null,
          users: data.users ?? 0,
          usersGrowth: data.usersGrowth ?? null,
          orders: data.orders ?? 0,
          ordersGrowth: data.ordersGrowth ?? null,
          products: data.products ?? 0,
          productsGrowth: data.productsGrowth ?? null,
          monthlyRevenue: Array.isArray(data.monthlyRevenue) ? data.monthlyRevenue : [],
          topProducts: Array.isArray(data.topProducts) ? data.topProducts : [],
        })
        setLoadError('')
        setLoading(false)
      } catch (err) {
        setLoadError(err?.response?.data?.message || err?.message || 'Failed to load analytics.')
        setLoading(false)
      }
    }

    fetchStats()
  }, [userInfo, timeRange])

  const revenueData = useMemo(() => {
    const labels = (stats.monthlyRevenue || []).map((m) => m.month)
    const values = (stats.monthlyRevenue || []).map((m) => Number(m.revenue || 0))
    return {
      labels,
      datasets: [
        {
          label: 'Revenue',
          data: values,
          borderColor: '#0b0b0b',
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#0b0b0b',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    }
  }, [stats.monthlyRevenue])

  // These breakdowns need dedicated API data. Keep empty (not mocked).
  const salesByCategoryData = useMemo(
    () => ({ labels: [], datasets: [{ label: 'Sales by Category', data: [] }] }),
    [],
  )
  const orderStatusData = useMemo(() => ({ labels: [], datasets: [{ data: [] }] }), [])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#6b7280' } },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.07)' },
        ticks: {
          color: '#6b7280',
          callback: (value) => formatCurrency(value),
        },
      },
    },
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#6b7280' } },
      y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.07)' }, ticks: { color: '#6b7280' } },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  }

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: '2rem', color: '#6b7280', fontWeight: 700 }}>Loading…</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Admin • Analytics</title>
      </Helmet>

      <div className="bw-analytics">
        <div className="bw-analytics__head">
          <div>
            <h1 className="bw-analytics__title">Analytics</h1>
            <p className="bw-analytics__subtitle">Live store performance (no mock data).</p>
          </div>

          <div className="bw-analytics__actions">
            <div className="bw-analytics__range">
              <label className="bw-analytics__label" htmlFor="analytics-range">
                Range
              </label>
              <select
                id="analytics-range"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bw-analytics__select"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>

            <button className="bw-btn bw-btn--ghost" type="button" disabled>
              <FiDownload size={16} />
              Export
            </button>
          </div>
        </div>

        {loadError && (
          <div className="bw-alert bw-alert--error" style={{ marginBottom: '1rem' }}>
            {loadError}
          </div>
        )}

        <div className="bw-metrics">
          <div className="bw-metric">
            <div className="bw-metric__top">
              <div className="bw-metric__icon bw-metric__icon--solid">
                <FiDollarSign size={18} />
              </div>
              {typeof stats.revenueGrowth === 'number' && (
                <div className={`bw-metric__trend ${stats.revenueGrowth >= 0 ? 'up' : 'down'}`}>
                  {stats.revenueGrowth >= 0 ? <FiTrendingUp size={16} /> : <FiTrendingDown size={16} />}
                  {Math.abs(stats.revenueGrowth)}%
                </div>
              )}
            </div>
            <div className="bw-metric__value">{formatCurrency(stats.revenue)}</div>
            <div className="bw-metric__label">Total Revenue</div>
          </div>

          <div className="bw-metric">
            <div className="bw-metric__top">
              <div className="bw-metric__icon">
                <FiShoppingCart size={18} />
              </div>
              {typeof stats.ordersGrowth === 'number' && (
                <div className={`bw-metric__trend ${stats.ordersGrowth >= 0 ? 'up' : 'down'}`}>
                  {stats.ordersGrowth >= 0 ? <FiTrendingUp size={16} /> : <FiTrendingDown size={16} />}
                  {Math.abs(stats.ordersGrowth)}%
                </div>
              )}
            </div>
            <div className="bw-metric__value">{Number(stats.orders || 0).toLocaleString()}</div>
            <div className="bw-metric__label">Total Orders</div>
          </div>

          <div className="bw-metric">
            <div className="bw-metric__top">
              <div className="bw-metric__icon">
                <FiUsers size={18} />
              </div>
              {typeof stats.usersGrowth === 'number' && (
                <div className={`bw-metric__trend ${stats.usersGrowth >= 0 ? 'up' : 'down'}`}>
                  {stats.usersGrowth >= 0 ? <FiTrendingUp size={16} /> : <FiTrendingDown size={16} />}
                  {Math.abs(stats.usersGrowth)}%
                </div>
              )}
            </div>
            <div className="bw-metric__value">{Number(stats.users || 0).toLocaleString()}</div>
            <div className="bw-metric__label">Users</div>
          </div>

          <div className="bw-metric">
            <div className="bw-metric__top">
              <div className="bw-metric__icon">
                <FiPackage size={18} />
              </div>
              {typeof stats.productsGrowth === 'number' && (
                <div className={`bw-metric__trend ${stats.productsGrowth >= 0 ? 'up' : 'down'}`}>
                  {stats.productsGrowth >= 0 ? <FiTrendingUp size={16} /> : <FiTrendingDown size={16} />}
                  {Math.abs(stats.productsGrowth)}%
                </div>
              )}
            </div>
            <div className="bw-metric__value">{Number(stats.products || 0).toLocaleString()}</div>
            <div className="bw-metric__label">Products</div>
          </div>
        </div>

        <div className="bw-charts">
          <div className="bw-card bw-card--large">
            <div className="bw-card__head">
              <div>
                <h3 className="bw-card__title">Revenue</h3>
                <p className="bw-card__subtitle">Monthly trend</p>
              </div>
            </div>
            <div className="bw-card__body bw-chart">
              {revenueData.labels.length === 0 ? (
                <div style={{ color: '#6b7280', fontWeight: 700 }}>No data yet.</div>
              ) : (
                <Line data={revenueData} options={chartOptions} />
              )}
            </div>
          </div>

          <div className="bw-card">
            <div className="bw-card__head">
              <div>
                <h3 className="bw-card__title">Sales By Category</h3>
                <p className="bw-card__subtitle">Needs category breakdown API</p>
              </div>
            </div>
            <div className="bw-card__body bw-chart">
              {salesByCategoryData.labels.length === 0 ? (
                <div style={{ color: '#6b7280', fontWeight: 700 }}>No data yet.</div>
              ) : (
                <Bar data={salesByCategoryData} options={barChartOptions} />
              )}
            </div>
          </div>

          <div className="bw-card">
            <div className="bw-card__head">
              <div>
                <h3 className="bw-card__title">Order Status</h3>
                <p className="bw-card__subtitle">Needs status breakdown API</p>
              </div>
            </div>
            <div className="bw-card__body bw-chart">
              {orderStatusData.labels.length === 0 ? (
                <div style={{ color: '#6b7280', fontWeight: 700 }}>No data yet.</div>
              ) : (
                <Doughnut data={orderStatusData} options={doughnutOptions} />
              )}
            </div>
          </div>

          <div className="bw-card">
            <div className="bw-card__head">
              <div>
                <h3 className="bw-card__title">Top Products</h3>
                <p className="bw-card__subtitle">From live catalog</p>
              </div>
            </div>
            <div className="bw-card__body">
              <div className="bw-top-products">
                {(stats.topProducts || []).length === 0 ? (
                  <div style={{ color: '#6b7280', fontWeight: 700 }}>No data yet.</div>
                ) : (
                  (stats.topProducts || []).map((p, idx) => (
                    <div key={p.id || idx} className="bw-top-products__item">
                      <div className="bw-top-products__rank">#{idx + 1}</div>
                      <div className="bw-top-products__info">
                        <div className="bw-top-products__name">{p.name}</div>
                        <div className="bw-top-products__meta">
                          <span>{p.category || 'Uncategorized'}</span>
                          <span className="bw-dot">•</span>
                          <span>{formatCurrency(p.price || 0)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Analytics

