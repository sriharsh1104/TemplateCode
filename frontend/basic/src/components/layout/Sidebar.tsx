import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import '../../styles/layout.scss';

type MenuItem = {
  title: string;
  path: string;
  icon: string;
  children?: { title: string; path: string }[];
};

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ collapsed, toggleSidebar }: SidebarProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const toggleSubMenu = (title: string) => {
    setExpandedMenu(expandedMenu === title ? null : title);
  };

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'dashboard',
    },
    {
      title: 'Patent Search',
      path: '/search',
      icon: 'search',
      children: [
        { title: 'Basic Search', path: '/search/basic' },
        { title: 'Advanced Search', path: '/search/advanced' },
        { title: 'Semantic Search', path: '/search/semantic' },
        { title: 'Citation Search', path: '/search/citation' },
      ],
    },
    {
      title: 'Collections',
      path: '/collections',
      icon: 'folder',
      children: [
        { title: 'My Collections', path: '/collections/my' },
        { title: 'Shared With Me', path: '/collections/shared' },
        { title: 'Recent', path: '/collections/recent' },
      ],
    },
    {
      title: 'Analytics',
      path: '/analytics',
      icon: 'insights',
      children: [
        { title: 'Patent Trends', path: '/analytics/trends' },
        { title: 'Company Analysis', path: '/analytics/companies' },
        { title: 'Technology Mapping', path: '/analytics/technology' },
        { title: 'Export Reports', path: '/analytics/reports' },
      ],
    },
    {
      title: 'Monitoring',
      path: '/monitoring',
      icon: 'visibility',
      children: [
        { title: 'Alerts', path: '/monitoring/alerts' },
        { title: 'Watched Patents', path: '/monitoring/watch-list' },
        { title: 'Watched Companies', path: '/monitoring/companies' },
      ],
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: 'settings',
      children: [
        { title: 'Profile', path: '/settings/profile' },
        { title: 'Preferences', path: '/settings/preferences' },
        { title: 'Subscriptions', path: '/settings/subscriptions' },
        { title: 'API Access', path: '/settings/api' },
      ],
    },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="toggle-btn" onClick={toggleSidebar}>
          <span className="material-icons">
            {collapsed ? 'menu_open' : 'menu'}
          </span>
        </div>
      </div>

      <div className="sidebar-content">
        {user && (
          <div className="user-info">
            <div className="avatar">
              {user.name.charAt(0)}
            </div>
            {!collapsed && (
              <div className="user-details">
                <h4>{user.name}</h4>
                <p>{user.userType}</p>
              </div>
            )}
          </div>
        )}

        <div className="quick-actions">
          {!collapsed && <p className="section-title">Quick Actions</p>}
          <div className="action-buttons">
            <button title="New Search">
              <span className="material-icons">search</span>
              {!collapsed && <span>New Search</span>}
            </button>
            <button title="Add to Collection">
              <span className="material-icons">add_to_photos</span>
              {!collapsed && <span>Add to Collection</span>}
            </button>
            <button title="Recent Patents">
              <span className="material-icons">history</span>
              {!collapsed && <span>Recent Patents</span>}
            </button>
          </div>
        </div>

        <nav className="sidebar-nav">
          {!collapsed && <p className="section-title">Main Menu</p>}
          <ul>
            {menuItems.map((item) => (
              <li key={item.title}>
                {item.children ? (
                  <div className={`menu-item ${expandedMenu === item.title ? 'expanded' : ''}`}>
                    <div className="menu-title" onClick={() => toggleSubMenu(item.title)}>
                      <span className="material-icons">{item.icon}</span>
                      {!collapsed && (
                        <>
                          <span>{item.title}</span>
                          <span className="material-icons toggle-icon">
                            {expandedMenu === item.title ? 'expand_less' : 'expand_more'}
                          </span>
                        </>
                      )}
                    </div>
                    {(!collapsed || expandedMenu === item.title) && (
                      <ul className="submenu">
                        {item.children.map((child) => (
                          <li key={child.title}>
                            <NavLink to={child.path}>
                              {child.title}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <NavLink to={item.path} className={({ isActive }) => isActive ? 'active' : ''}>
                    <span className="material-icons">{item.icon}</span>
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar; 