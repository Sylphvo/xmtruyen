import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

import { Breadcrumbs } from './Breadcrumbs';

export const AppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="page-layout">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="app-main">
        <Header toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} isSidebarCollapsed={isSidebarCollapsed} />
        <main className="app-content">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
};
