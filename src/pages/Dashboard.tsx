import React from 'react';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Dashboard</h1>
        <p className="dashboard__subtitle">Welcome to your dashboard</p>
      </div>
      
      <div className="dashboard__stats">
        <div className="stat-card">
          <h3 className="stat-card__title">Total Users</h3>
          <p className="stat-card__value">1,234</p>
          <p className="stat-card__change positive">+12.5%</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-card__title">Revenue</h3>
          <p className="stat-card__value">$12,345</p>
          <p className="stat-card__change positive">+8.3%</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-card__title">Orders</h3>
          <p className="stat-card__value">856</p>
          <p className="stat-card__change negative">-2.7%</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-card__title">Conversion</h3>
          <p className="stat-card__value">12.8%</p>
          <p className="stat-card__change positive">+3.2%</p>
        </div>
      </div>
      
      <div className="dashboard__content">
        <div className="dashboard__section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="card">
            <ul className="activity-list">
              <li className="activity-item">
                <div className="activity-item__icon success"></div>
                <div className="activity-item__content">
                  <p className="activity-item__text">New user registered</p>
                  <p className="activity-item__time">5 minutes ago</p>
                </div>
              </li>
              <li className="activity-item">
                <div className="activity-item__icon warning"></div>
                <div className="activity-item__content">
                  <p className="activity-item__text">User updated their profile</p>
                  <p className="activity-item__time">1 hour ago</p>
                </div>
              </li>
              <li className="activity-item">
                <div className="activity-item__icon error"></div>
                <div className="activity-item__content">
                  <p className="activity-item__text">Payment failed</p>
                  <p className="activity-item__time">2 hours ago</p>
                </div>
              </li>
              <li className="activity-item">
                <div className="activity-item__icon success"></div>
                <div className="activity-item__content">
                  <p className="activity-item__text">New order received</p>
                  <p className="activity-item__time">3 hours ago</p>
                </div>
              </li>
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