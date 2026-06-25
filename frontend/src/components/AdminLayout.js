import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiBarChart2,
  FiBell,
  FiBox,
  FiGrid,
  FiLogOut,
  FiSearch,
  FiSettings,
  FiShoppingCart,
  FiUsers
} from 'react-icons/fi';
import './AdminLayout.css';
import LottiePlayer from './LottiePlayer';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const adminLogoLottieSrc = process.env.REACT_APP_ADMIN_LOGO_LOTTIE_SRC;

  const navItems = [
    { path: '/admin', exact: true, icon: FiGrid, label: 'Dashboard' },
    { path: '/admin/users', icon: FiUsers, label: 'Users' },
    { path: '/admin/analytics', icon: FiBarChart2, label: 'Analytics' },
    { path: '/admin/orders', icon: FiShoppingCart, label: 'Orders' },
    { path: '/admin/products', icon: FiBox, label: 'Products' },
    { path: '/admin/settings', icon: FiSettings, label: 'Settings' }
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  const headerMeta = (() => {
    const pathname = location.pathname;
    if (pathname === '/admin') {
      return { title: 'Dashboard Overview', subtitle: "Welcome back, here's what's happening today" };
    }
    if (pathname.startsWith('/admin/users')) {
      return { title: 'User Management', subtitle: 'Manage customer accounts and administrative access' };
    }
    if (pathname.startsWith('/admin/orders')) {
      return { title: 'Order Management', subtitle: 'Manage customer orders and fulfillment' };
    }
    if (pathname.startsWith('/admin/products')) {
      return { title: 'Product Management', subtitle: 'Manage product catalog and inventory' };
    }
    if (pathname.startsWith('/admin/analytics')) {
      return { title: 'Analytics', subtitle: 'Track sales, customers and performance' };
    }
    if (pathname.startsWith('/admin/settings')) {
      return { title: 'Settings', subtitle: 'Configure your store preferences' };
    }
    return { title: 'Admin', subtitle: 'Manage your store' };
  })();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">
              {adminLogoLottieSrc ? (
                <LottiePlayer src={adminLogoLottieSrc} className="logo-lottie" />
              ) : (
                <FiBox size={18} />
              )}
            </div>
            <span className="logo-text">Cordes</span>
          </div>
        </div>
        

        <nav className="sidebar-nav">
          <div className="nav-section">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
                >
                  <span className="nav-icon">
                    <Icon size={18} />
                  </span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-profile">
            <img
              src="https://cdn-icons-png.flaticon.com/512/17003/17003310.png"
              alt="Admin"
              className="admin-avatar"
            />
            <div className="admin-info">
              <p className="admin-name">{userInfo ? userInfo.name : 'Admin User'}</p>
              <p className="admin-role">Administrator</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="header-content">
            <div className="header-title">
              <h1>{headerMeta.title}</h1>
              <p>{headerMeta.subtitle}</p>
            </div>
            <div className="header-actions">
              <div className="search-container">
                <span className="search-icon">
                  <FiSearch size={16} />
                </span>
                <input type="text" placeholder="Search..." className="search-input" />
              </div>
              <button className="notification-btn" type="button" aria-label="Notifications">
                <FiBell size={18} />
                <span className="notification-badge">3</span>
              </button>
            </div>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
