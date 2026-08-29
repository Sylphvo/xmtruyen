import React, { useState } from 'react';
import { Outlet, useSearchParams, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Breadcrumbs } from './Breadcrumbs';
import DocsView from '../docs/DocsView';

export const AppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const isDocsView = searchParams.get('view') === 'docs';
  const getWorkspaceId = () => {
    const path = location.pathname.split('/')[1];
    return path || 'dashboard';
  };

  return (
    <div className="page-layout">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="app-main">
        <Header toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} isSidebarCollapsed={isSidebarCollapsed} />
        <main className="app-content">
          <Breadcrumbs />
          {isDocsView ? <DocsView workspaceId={getWorkspaceId()} /> : <Outlet />}
        </main>
      </div>
    </div>
  );
};
