import React from 'react';
import { useDashboardStats } from '../api/hooks/useUser';
import { useGlobalLoader } from '../hooks/useGlobalLoader';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  const { data: stats, isLoading, isError } = useDashboardStats();
  
  // Use the global loader hook
  useGlobalLoader(isLoading, "Loading dashboard data...");

  if (isError) {
    return <div className="dashboard-error">Failed to load dashboard data. Please try again later.</div>;
  }

  // Use sample data if API data is not available
  const dashboardData = stats || {
    users: { total: 1234, growth: 12.5 },
    revenue: { total: 12345, growth: 8.3 },
    orders: { total: 856, growth: -2.7 },
    conversion: { rate: 12.8, growth: 3.2 },
    activities: [
      { type: 'success', text: 'New user registered', time: '5 minutes ago' },
      { type: 'warning', text: 'User updated their profile', time: '1 hour ago' },
      { type: 'error', text: 'Payment failed', time: '2 hours ago' },
      { type: 'success', text: 'New order received', time: '3 hours ago' }
    ]
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Dashboard</h1>
        <p className="dashboard__subtitle">Welcome to your dashboard</p>
      </div>
      
      <div className="dashboard__stats">
        <div className="stat-card">
          <h3 className="stat-card__title">Total Users</h3>
          <p className="stat-card__value">{dashboardData.users.total.toLocaleString()}</p>
          <p className={`stat-card__change ${dashboardData.users.growth >= 0 ? 'positive' : 'negative'}`}>
            {dashboardData.users.growth >= 0 ? '+' : ''}{dashboardData.users.growth}%
          </p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-card__title">Revenue</h3>
          <p className="stat-card__value">${dashboardData.revenue.total.toLocaleString()}</p>
          <p className={`stat-card__change ${dashboardData.revenue.growth >= 0 ? 'positive' : 'negative'}`}>
            {dashboardData.revenue.growth >= 0 ? '+' : ''}{dashboardData.revenue.growth}%
          </p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-card__title">Orders</h3>
          <p className="stat-card__value">{dashboardData.orders.total.toLocaleString()}</p>
          <p className={`stat-card__change ${dashboardData.orders.growth >= 0 ? 'positive' : 'negative'}`}>
            {dashboardData.orders.growth >= 0 ? '+' : ''}{dashboardData.orders.growth}%
          </p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-card__title">Conversion</h3>
          <p className="stat-card__value">{dashboardData.conversion.rate}%</p>
          <p className={`stat-card__change ${dashboardData.conversion.growth >= 0 ? 'positive' : 'negative'}`}>
            {dashboardData.conversion.growth >= 0 ? '+' : ''}{dashboardData.conversion.growth}%
          </p>
        </div>
      </div>
      
      <div className="dashboard__content">
        <div className="dashboard__section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="card">
            <ul className="activity-list">
              {dashboardData.activities.map((activity, index) => (
                <li className="activity-item" key={index}>
                  <div className={`activity-item__icon ${activity.type}`}></div>
                  <div className="activity-item__content">
                    <p className="activity-item__text">{activity.text}</p>
                    <p className="activity-item__time">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="dashboard__section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="card">
            <div className="quick-actions">
              <button className="quick-action">
                <span className="quick-action__icon">📊</span>
                <span className="quick-action__text">View Reports</span>
              </button>
              <button className="quick-action">
                <span className="quick-action__icon">👤</span>
                <span className="quick-action__text">Add User</span>
              </button>
              <button className="quick-action">
                <span className="quick-action__icon">📝</span>
                <span className="quick-action__text">New Post</span>
              </button>
              <button className="quick-action">
                <span className="quick-action__icon">⚙️</span>
                <span className="quick-action__text">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 