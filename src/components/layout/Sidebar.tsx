import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.scss';

// MUI Icons
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar__content">
        <nav className="sidebar__nav">
          <ul className="sidebar__menu">
            <li className="sidebar__menu-item">
              <NavLink 
                to="/dashboard"
                className={({ isActive }) => 
                  `sidebar__menu-link ${isActive ? 'active' : ''}`
                }
              >
                <DashboardOutlinedIcon />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li className="sidebar__menu-item">
              <NavLink 
                to="/profile"
                className={({ isActive }) => 
                  `sidebar__menu-link ${isActive ? 'active' : ''}`
                }
              >
                <PersonOutlineOutlinedIcon />
                <span>Profile</span>
              </NavLink>
            </li>
            <li className="sidebar__menu-item">
              <NavLink 
                to="/settings"
                className={({ isActive }) => 
                  `sidebar__menu-link ${isActive ? 'active' : ''}`
                }
              >
                <SettingsOutlinedIcon />
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="sidebar__footer">
          <button className="sidebar__logout">
            <LogoutOutlinedIcon />
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 