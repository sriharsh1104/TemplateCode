import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useLogout } from '../../api/hooks/useAuth';
import { useGlobalLoader } from '../../hooks/useGlobalLoader';
import './Sidebar.scss';

// MUI Icons
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const logout = useLogout();
  
  // Use global loader for logout
  useGlobalLoader(logout.isPending, "Logging out...");

  const handleLogout = () => {
    // Call the logout mutation
    logout.mutate();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar__content">
        <nav className="sidebar__nav">
          <ul className="sidebar__menu">
            <li className="sidebar__menu-item">
              <NavLink 
                to="/auth/dashboard"
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
                to="/auth/profile"
                className={({ isActive }) => 
                  `sidebar__menu-link ${isActive ? 'active' : ''}`
                }
              >
                <PersonOutlineOutlinedIcon />
                <span>Profile</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="sidebar__footer">
          <button 
            className="sidebar__logout" 
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            <LogoutOutlinedIcon />
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 