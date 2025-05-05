import { ReactNode, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import '../../styles/layout.scss';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="app-container">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="main-container">
        {isAuthenticated && (
          <Sidebar 
            collapsed={sidebarCollapsed} 
            toggleSidebar={toggleSidebar} 
          />
        )}
        
        <main className={`content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          {children}
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default MainLayout; 