import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Calendar, ChevronsLeft, Moon, Sun, ClipboardList, ChevronDown, User, Settings, ArrowUpCircle, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute('data-bs-theme') || 'light'
  );
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <header className="app-header justify-content-between position-relative">
      <div className="d-flex align-items-center">
        <button className="btn btn-icon me-3 text-dark rounded-3 border-0 d-flex justify-content-center align-items-center" style={{ width: '32px', height: '32px', backgroundColor: 'var(--bg-main)' }}>
          <ChevronsLeft size={16} />
        </button>
        <form className="d-none d-md-flex align-items-center position-relative w-100" style={{ maxWidth: '300px' }}>
          <div className="position-absolute ms-3">
            <Search size={16} className="text-muted" />
          </div>
          <input type="text" className="form-control form-control-fill" placeholder="Search anything's" />
        </form>
        
        <div className="ms-4 d-none d-lg-flex align-items-center rounded-pill px-3 py-1 border-0" style={{ backgroundColor: 'var(--bg-main)' }}>
          <span className="text-muted small me-2">Today New Leads</span>
          <span className="badge rounded-pill px-2 py-1" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--primary)' }}>27</span>
        </div>
      </div>
      
      <div className="d-flex align-items-center gap-3">
        <div className="d-flex align-items-center gap-3 rounded-pill px-3 py-2" style={{ backgroundColor: 'var(--bg-main)' }}>
          <Sun size={16} className={theme === 'light' ? 'text-primary' : 'text-muted'} style={{ cursor: 'pointer' }} onClick={() => toggleTheme('light')} />
          <Moon size={16} className={theme === 'dark' ? 'text-primary' : 'text-muted'} style={{ cursor: 'pointer' }} onClick={() => toggleTheme('dark')} />
        </div>
        
        <div className="d-flex align-items-center gap-3 ms-2">
          <button className="btn-icon position-relative border-0 bg-transparent p-0 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
            <ClipboardList size={18} className="text-muted" />
            <span className="position-absolute top-0 end-0 bg-primary rounded-circle" style={{ width: '6px', height: '6px', marginTop: '4px', marginRight: '4px' }}></span>
          </button>
          <button className="btn-icon border-0 bg-transparent p-0 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
            <Bell size={18} className="text-muted" />
          </button>
          <button className="btn-icon border-0 bg-transparent p-0 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
            <Calendar size={18} className="text-muted" />
          </button>
        </div>
        
        <div className="position-relative" ref={profileRef}>
          <div className="d-flex align-items-center gap-2 ms-3" style={{ cursor: 'pointer' }} onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <div className="text-end d-none d-sm-block">
              <div className="fw-bold lh-sm mb-1" style={{ fontSize: '14px', color: 'var(--text-heading)' }}>Robert Brown</div>
              <div className="text-muted d-flex align-items-center justify-content-end" style={{ fontSize: '12px' }}>
                <ChevronDown size={12} className="me-1" />
                <span>Manager</span>
              </div>
            </div>
            <div className="position-relative">
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Profile" className="avatar ms-2 rounded-circle border border-2" style={{ width: '40px', height: '40px', borderColor: 'var(--border-color)' }} />
              <span className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-2" style={{ width: '10px', height: '10px', right: '0', borderColor: 'var(--bg-header)' }}></span>
            </div>
          </div>
          
          {isProfileOpen && (
            <div className="position-absolute end-0 mt-3 rounded-3 shadow-lg" style={{ width: '240px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', zIndex: 1050 }}>
              <div className="p-3 border-bottom" style={{ borderColor: 'var(--border-color) !important' }}>
                <div className="d-flex align-items-center gap-3">
                  <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Profile" className="rounded-circle" style={{ width: '40px', height: '40px' }} />
                  <div>
                    <div className="fw-bold" style={{ fontSize: '14px', color: 'var(--text-heading)' }}>Robert Brown</div>
                    <div className="text-muted" style={{ fontSize: '12px' }}>robert@gmail.com</div>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <a href="#" className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none rounded-2" style={{ color: 'var(--text-main)' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <User size={16} /> <span style={{ fontSize: '14px' }}>View Profile</span>
                </a>
                <a href="#" className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none rounded-2" style={{ color: 'var(--text-main)' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <ClipboardList size={16} /> <span style={{ fontSize: '14px' }}>My Task</span>
                </a>
                <a href="#" className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none rounded-2" style={{ color: 'var(--text-main)' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <Settings size={16} /> <span style={{ fontSize: '14px' }}>Account Settings</span>
                </a>
                <a href="#" className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none rounded-2" style={{ color: 'var(--text-main)' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <ArrowUpCircle size={16} /> <span style={{ fontSize: '14px' }}>Upgrade Plan</span>
                </a>
              </div>
              <div className="p-2 border-top" style={{ borderColor: 'var(--border-color) !important' }}>
                <a href="#" className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none rounded-2 text-danger" onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(220,53,69,0.1)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <LogOut size={16} /> <span style={{ fontSize: '14px' }}>Log Out</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
