import React, { useState, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import AdminLayout from '../../components/AdminLayout';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../utils/formatCurrency';

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
  Filler
);

const Dashboard = () => {
  const history = useHistory();
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const [stats, setStats] = useState({
    revenue: 0,
    users: 0,
    orders: 0,
    products: 0
  });

  const [chartData, setChartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [0, 0, 0, 0, 0, 0],
        borderColor: '#1e40af',
        backgroundColor: 'rgba(30, 64, 175, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#1e40af',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8
      }
    ]
  });

  const barChartData = {
    labels: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'],
    datasets: [
      {
        label: 'Sales',
        data: [0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(147, 51, 234, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(147, 51, 234, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(147, 51, 234, 1)'
        ],
        borderWidth: 2,
        pointBackgroundColor: '#1e40af',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8
      }
    ]
  };

  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusModalOrder, setStatusModalOrder] = useState(null);
  const [statusModalValue, setStatusModalValue] = useState('processing');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
	        const token = userInfo?.token;
	        if (!token) {
		        setLoadError('Not authenticated.');
		        setLoading(false);
		        return;
	        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

	        const { data } = await axios.get('/api/admin/statistics', config);
        
        setStats({
          revenue: data.revenue ?? data.totalRevenue ?? 0,
          users: data.users ?? data.totalUsers ?? 0,
          orders: data.orders ?? data.totalOrders ?? 0,
          products: data.products ?? data.totalProducts ?? 0,
          revenueGrowth: data.revenueGrowth ?? null,
          usersGrowth: data.usersGrowth ?? null,
          ordersGrowth: data.ordersGrowth ?? null,
          productsGrowth: data.productsGrowth ?? null,
        });

        if (data.monthlyRevenue && data.monthlyRevenue.length > 0) {
          setChartData({
            labels: data.monthlyRevenue.map(item => item.month),
            datasets: [{
              label: 'Revenue',
              data: data.monthlyRevenue.map(item => item.revenue),
              borderColor: '#1e40af',
              backgroundColor: 'rgba(30, 64, 175, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#1e40af',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 8
            }]
          });
        }

	        if (data.topProducts) {
	          setTopProducts(data.topProducts);
	        }

	        if (data.recentOrders) {
	          setRecentOrders(data.recentOrders);
	        }

	        try {
	          const { data: activityData } = await axios.get('/api/admin/activities', config);
	          setActivities(Array.isArray(activityData) ? activityData : []);
	        } catch (e) {
	          setActivities([]);
	        }

	        setLoadError('');
	        setLoading(false);
	      } catch (error) {
		        console.error('Error fetching dashboard data:', error);
	        setLoadError(error?.response?.data?.message || error?.message || 'Failed to load dashboard.');
	        setStats({ revenue: 0, users: 0, orders: 0, products: 0 });
	        setChartData((prev) => ({
	          ...prev,
	          datasets: prev.datasets.map((d) => ({ ...d, data: [0, 0, 0, 0, 0, 0] })),
	        }));
	        setTopProducts([]);
	        setRecentOrders([]);
	        setActivities([]);
	        setLoading(false);
	      }
	    };

    fetchDashboardData();
  }, [userInfo]);

  const getAuthConfig = () => {
    const token = userInfo?.token;
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  };

  const normalizeStatus = (value) => {
    const raw = typeof value === 'string' ? value : 'processing';
    const s = raw.trim().toLowerCase();
    if (s === 'success' || s === 'failed' || s === 'processing') return s;
    return 'processing';
  };

  const statusLabel = (value) => {
    const s = normalizeStatus(value);
    if (s === 'success') return 'Successful';
    if (s === 'failed') return 'Failed';
    return 'Processing';
  };

  // Redirect if not admin or not logged in
  if (!userInfo || !userInfo.isAdmin) {
    return <Redirect to="/login" />;
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6'
        },
        ticks: {
          color: '#6b7280',
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 8
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6'
        },
        ticks: {
          color: '#6b7280'
        }
      }
    }
  };

  const getStatusClass = (status) => {
    switch((status || '').toString().toLowerCase()) {
      case 'completed': return 'completed';
      case 'pending': return 'pending';
      case 'cancelled': return 'cancelled';
      case 'processing': return 'pending';
      case 'success': return 'completed';
      case 'failed': return 'cancelled';
      default: return 'pending';
    }
  };

  const openStatusEditor = (order) => {
    setStatusModalOrder(order);
    setStatusModalValue(normalizeStatus(order?.status));
    setStatusModalOpen(true);
  };

  const closeStatusEditor = () => {
    setStatusModalOpen(false);
    setStatusModalOrder(null);
  };

  const saveStatus = async () => {
    const orderId = statusModalOrder?.id;
    if (!orderId) return;

    try {
      setSavingStatus(true);
      await axios.put(`/api/orders/${orderId}/admin-status`, { status: statusModalValue }, getAuthConfig());
      setRecentOrders((prev) =>
        (prev || []).map((o) => (o.id === orderId ? { ...o, status: statusModalValue } : o)),
      );
      closeStatusEditor();
    } catch (err) {
      console.error('Failed to update order status', err);
      alert(err?.response?.data?.message || 'Failed to update order status');
    } finally {
      setSavingStatus(false);
    }
  };

  const deleteOrder = async (order) => {
    const orderId = order?.id;
    if (!orderId) return;

    const ok = window.confirm('Delete this order? This cannot be undone.');
    if (!ok) return;

    try {
      setDeletingOrderId(orderId);
      await axios.delete(`/api/orders/${orderId}`, getAuthConfig());
      setRecentOrders((prev) => (prev || []).filter((o) => o.id !== orderId));
    } catch (err) {
      console.error('Failed to delete order', err);
      alert(err?.response?.data?.message || 'Failed to delete order');
    } finally {
      setDeletingOrderId(null);
    }
  };

  const exportRecentOrders = () => {
    const rows = (displayRecentOrders || []).map((o) => ({
      id: o.id || '',
      customer: o.customer || '',
      email: o.email || '',
      product: o.product || 'Multiple Items',
      amount: Number(o.amount || 0),
      status: statusLabel(o.status),
      date: o.date || '',
    }));

    const header = ['Order ID', 'Customer', 'Email', 'Product', 'Amount', 'Status', 'Date'];
    const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [
      header.join(','),
      ...rows.map((r) =>
        [
          escape(r.id),
          escape(r.customer),
          escape(r.email),
          escape(r.product),
          escape(r.amount.toFixed(2)),
          escape(r.status),
          escape(r.date),
        ].join(','),
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recent-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span>Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

	  const displayTopProducts = Array.isArray(topProducts) ? topProducts : [];
	  const displayRecentOrders = Array.isArray(recentOrders) ? recentOrders : [];

	  return (
	    <AdminLayout>
	      {loadError && (
	        <div className="bw-alert bw-alert--error" style={{ marginBottom: '1rem' }}>
	          {loadError}
	        </div>
	      )}

	      {/* Stats Cards */}
	      <div className="stats-grid">
	        <div className="stat-card">
	          <div className="stat-header">
	            <div className="stat-info">
	              <p className="stat-label">Total Revenue</p>
	              <h3 className="stat-value">{formatCurrency(stats.revenue)}</h3>
	              {typeof stats.revenueGrowth === 'number' && (
	                <div className={`stat-change ${stats.revenueGrowth >= 0 ? 'positive' : 'negative'}`}>
	                  <i className={`fas ${stats.revenueGrowth >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
	                  <span>{Math.abs(stats.revenueGrowth)}%</span>
	                  <span className="stat-change-text">vs last month</span>
	                </div>
	              )}
	            </div>
	            <div className="stat-icon blue">
	              <i className="fas fa-dollar-sign"></i>
	            </div>
	          </div>
	        </div>

        <div className="stat-card">
          <div className="stat-header">
	            <div className="stat-info">
	              <p className="stat-label">Total Users</p>
	              <h3 className="stat-value">{stats.users.toLocaleString()}</h3>
	              {typeof stats.usersGrowth === 'number' && (
	                <div className={`stat-change ${stats.usersGrowth >= 0 ? 'positive' : 'negative'}`}>
	                  <i className={`fas ${stats.usersGrowth >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
	                  <span>{Math.abs(stats.usersGrowth)}%</span>
	                  <span className="stat-change-text">vs last month</span>
	                </div>
	              )}
	            </div>
            <div className="stat-icon green">
              <i className="fas fa-users"></i>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
	            <div className="stat-info">
	              <p className="stat-label">Total Orders</p>
	              <h3 className="stat-value">{stats.orders.toLocaleString()}</h3>
	              {typeof stats.ordersGrowth === 'number' && (
	                <div className={`stat-change ${stats.ordersGrowth >= 0 ? 'positive' : 'negative'}`}>
	                  <i className={`fas ${stats.ordersGrowth >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
	                  <span>{Math.abs(stats.ordersGrowth)}%</span>
	                  <span className="stat-change-text">vs last month</span>
	                </div>
	              )}
	            </div>
            <div className="stat-icon orange">
              <i className="fas fa-shopping-cart"></i>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
	            <div className="stat-info">
	              <p className="stat-label">Products</p>
	              <h3 className="stat-value">{stats.products.toLocaleString()}</h3>
	              {typeof stats.productsGrowth === 'number' && (
	                <div className={`stat-change ${stats.productsGrowth >= 0 ? 'positive' : 'negative'}`}>
	                  <i className={`fas ${stats.productsGrowth >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
	                  <span>{Math.abs(stats.productsGrowth)}%</span>
	                  <span className="stat-change-text">vs last month</span>
	                </div>
	              )}
	            </div>
            <div className="stat-icon purple">
              <i className="fas fa-box"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Revenue Analytics</h3>
              <p className="chart-subtitle">Monthly revenue overview</p>
            </div>
            <div className="chart-filters">
              <button className="filter-btn active">6M</button>
              <button className="filter-btn">1Y</button>
            </div>
          </div>
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Sales by Category</h3>
              <p className="chart-subtitle">Product category distribution</p>
            </div>
            <div className="chart-filters">
              <button className="filter-btn active">Current</button>
            </div>
          </div>
          <div className="chart-container">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Products Row */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Top Products</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="products-list">
	            {displayTopProducts.length === 0 ? (
	              <div style={{ padding: '1rem', color: '#6b7280' }}>No products yet.</div>
	            ) : displayTopProducts.slice(0, 4).map(product => (
	              <div key={product.id} className="product-item">
	                {product.image ? (
	                  <img src={product.image} alt={product.name} className="product-image" />
	                ) : (
	                  <div className="product-image" style={{ display: 'grid', placeItems: 'center', background: '#f3f4f6', color: '#6b7280', fontWeight: 800 }}>
	                    {String(product.name || 'P').charAt(0).toUpperCase()}
	                  </div>
	                )}
	                <div className="product-info">
	                  <p className="product-name">{product.name}</p>
	                  <p className="product-category">{product.category || 'Uncategorized'}</p>
	                </div>
	                <div className="product-stats">
	                  <p className="product-price">{formatCurrency(product.price || 0)}</p>
	                </div>
	              </div>
	            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title-section">
            <h3>Recent Orders</h3>
            <p>Latest customer orders and transactions</p>
          </div>
          <div className="table-actions">
            <button className="btn btn-secondary" type="button" onClick={exportRecentOrders}>
              <i className="fas fa-download"></i>
              Export
            </button>
            <button className="btn btn-primary" type="button" onClick={() => history.push('/admin/orders')}>
              <i className="fas fa-plus"></i>
              Add Order
            </button>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
	              {displayRecentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '1.5rem 1rem', color: '#6b7280', textAlign: 'center' }}>
                      No recent orders yet.
                    </td>
                  </tr>
                ) : displayRecentOrders.map(order => (
	                <tr key={order.id}>
                  <td>
                    <span className="font-medium">#{order.id ? order.id.toString().slice(-5) : '00000'}</span>
                  </td>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-avatar" style={{background: '#1e40af', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold'}}>
                        {order.customer ? order.customer.charAt(0).toUpperCase() : 'G'}
                      </div>
                      <div className="customer-info">
                        <div>{order.customer || 'Guest'}</div>
                        <div>{order.email || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td>{order.product || 'Multiple Items'}</td>
                  <td className="font-semibold">{formatCurrency(order.amount || 0)}</td>
	                  <td>
	                    <span className={`status-badge ${getStatusClass(order.status)}`}>
	                      {statusLabel(order.status)}
	                    </span>
	                  </td>
                  <td>{order.date || 'N/A'}</td>
	                  <td>
	                    <div className="action-buttons">
	                      <button
                          className="action-btn view"
                          title="View"
                          type="button"
                          onClick={() => history.push(`/order/${order.id}`)}
                        >
	                        <i className="fas fa-eye"></i>
	                      </button>
	                      <button
                          className="action-btn edit"
                          title="Edit status"
                          type="button"
                          onClick={() => openStatusEditor(order)}
                        >
	                        <i className="fas fa-edit"></i>
	                      </button>
	                      <button
                          className="action-btn delete"
                          title="Delete"
                          type="button"
                          disabled={deletingOrderId === order.id}
                          onClick={() => deleteOrder(order)}
                        >
	                        <i className="fas fa-trash"></i>
	                      </button>
	                    </div>
	                  </td>
	                </tr>
	              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row */}
	      <div className="bottom-grid">
        <div className="chart-card">
          <h3 className="chart-title" style={{marginBottom: '1rem'}}>Recent Activity</h3>
          <div className="activity-list">
            {activities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-dot ${activity.type}`}></div>
                <div className="activity-content">
                  <p className="activity-text">{activity.text}</p>
                  <p className="activity-meta">{activity.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

	        <div className="chart-card">
	          <h3 className="chart-title" style={{marginBottom: '1rem'}}>System Status</h3>
	          <div style={{ color: '#6b7280', fontWeight: 700 }}>
	            No system telemetry configured yet.
	          </div>
	        </div>
	      </div>

        {statusModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 25000,
              display: 'grid',
              placeItems: 'center',
              padding: 18,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(10px)',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Update order status"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeStatusEditor();
            }}
          >
            <div
              style={{
                width: 'min(520px, 100%)',
                background: 'rgba(255,255,255,0.96)',
                border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: 18,
                boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
                padding: 18,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', color: 'rgba(0,0,0,0.6)' }}>
                    ORDER
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 950, color: '#0b0b0b' }}>
                    #{(statusModalOrder?.id || '').toString().slice(-5)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeStatusEditor}
                  aria-label="Close"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    border: '1px solid rgba(0,0,0,0.14)',
                    background: 'rgba(255,255,255,0.9)',
                    cursor: 'pointer',
                    fontSize: 18,
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ marginTop: 12, fontWeight: 800, color: '#0b0b0b' }}>Status</div>
              <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
                {['processing', 'success', 'failed'].map((s) => (
                  <label
                    key={s}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '12px 12px',
                      borderRadius: 14,
                      border: '1px solid rgba(0,0,0,0.12)',
                      background: 'rgba(255,255,255,0.85)',
                      cursor: 'pointer',
                      fontWeight: 800,
                      color: '#0b0b0b',
                    }}
                  >
                    <span style={{ textTransform: 'capitalize' }}>{s}</span>
                    <input
                      type="radio"
                      name="adminStatus"
                      value={s}
                      checked={statusModalValue === s}
                      onChange={() => setStatusModalValue(s)}
                    />
                  </label>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
                <button
                  type="button"
                  onClick={closeStatusEditor}
                  style={{
                    height: 46,
                    borderRadius: 14,
                    border: '1px solid rgba(0,0,0,0.16)',
                    background: 'rgba(255,255,255,0.95)',
                    fontWeight: 950,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveStatus}
                  disabled={savingStatus}
                  style={{
                    height: 46,
                    borderRadius: 14,
                    border: '1px solid rgba(0,0,0,0.16)',
                    background: '#0b0b0b',
                    color: '#ffffff',
                    fontWeight: 950,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: savingStatus ? 'progress' : 'pointer',
                    opacity: savingStatus ? 0.7 : 1,
                  }}
                >
                  {savingStatus ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
	    </AdminLayout>
	  );
};

export default Dashboard;
