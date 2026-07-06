import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const AppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="page-layout">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="app-main">
        <Header toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} isSidebarCollapsed={isSidebarCollapsed} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
