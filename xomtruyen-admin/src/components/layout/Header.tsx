import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Calendar, ChevronsLeft, Moon, Sun, ClipboardList, ChevronDown, User, Settings, ArrowUpCircle, LogOut, Lock, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarCollapsed }) => {
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute('data-bs-theme') || 'light'
  );
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
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
        <button 
          onClick={toggleSidebar}
          className="btn btn-icon me-3 text-dark rounded-3 border-0 d-flex justify-content-center align-items-center" 
          style={{ width: '32px', height: '32px', backgroundColor: 'var(--bg-main)' }}
        >
          <ChevronsLeft size={16} style={{ transform: isSidebarCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
        <form className="d-none d-md-flex align-items-center position-relative w-100" style={{ maxWidth: '300px' }}>
          <div className="position-absolute ms-3">
            <Search size={16} className="text-muted" />
          </div>
          <input type="text" className="form-control form-control-fill" placeholder="Search anything's" />
        </form>
        
        <div className="ms-4 d-none d-lg-flex align-items-center rounded-pill px-3 py-1 border border-secondary-subtle text-nowrap" style={{ backgroundColor: 'transparent' }}>
          <span className="fw-medium me-2" style={{ fontSize: '13.5px', color: 'var(--text-heading)' }}>Today New Leads</span>
          <span className="badge rounded-pill px-2 py-1" style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--primary)', fontSize: '12px', fontWeight: '600' }}>27</span>
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
          <div className="position-relative" ref={notificationRef}>
            <button 
              className="btn-icon border-0 bg-transparent p-0 d-flex align-items-center justify-content-center" 
              style={{ width: '32px', height: '32px' }}
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <Bell size={18} className="text-muted" />
            </button>
            
            {isNotificationOpen && (
              <div className="position-absolute mt-3 rounded-3 shadow-lg" style={{ width: '340px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', zIndex: 1050, left: '50%', transform: 'translateX(-50%)' }}>
                <div className="p-3 border-bottom d-flex align-items-center gap-2" style={{ borderColor: 'var(--border-color) !important' }}>
                  <span className="fw-bold" style={{ fontSize: '15px', color: 'var(--text-heading)' }}>Notifications</span>
                  <span className="badge rounded-pill" style={{ backgroundColor: 'var(--primary)', color: '#fff', fontSize: '12px' }}>9</span>
                </div>
                
                <div className="d-flex flex-column" style={{ maxHeight: '380px', overflowY: 'auto' }}>
                  <div className="d-flex align-items-start gap-3 p-3 border-bottom" style={{ borderColor: 'var(--border-color) !important', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <div className="position-relative">
                      <img src="https://i.pravatar.cc/150?u=emma" alt="Emma Smith" className="rounded-circle" style={{ width: '36px', height: '36px', objectFit: 'cover' }} />
                      <span className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-2" style={{ width: '12px', height: '12px', right: '-2px', bottom: '-2px', borderColor: 'var(--bg-card)' }}></span>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className="fw-semibold" style={{ fontSize: '14px', color: 'var(--text-heading)' }}>Emma Smith</span>
                        <span className="text-muted" style={{ fontSize: '12px' }}>7 hr ago</span>
                      </div>
                      <div className="text-muted" style={{ fontSize: '13px' }}>Need to update the details.</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3 p-3 border-bottom" style={{ borderColor: 'var(--border-color) !important', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0" style={{ width: '36px', height: '36px', backgroundColor: '#00a65a', fontSize: '16px' }}>
                      D
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className="fw-semibold" style={{ fontSize: '14px', color: 'var(--text-heading)' }}>Design Team</span>
                        <span className="text-muted" style={{ fontSize: '12px' }}>6 hr ago</span>
                      </div>
                      <div className="text-muted" style={{ fontSize: '13px' }}>Check your shared folder.</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3 p-3 border-bottom" style={{ borderColor: 'var(--border-color) !important', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0" style={{ width: '36px', height: '36px', backgroundColor: '#151521' }}>
                      <Lock size={16} />
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className="fw-semibold" style={{ fontSize: '14px', color: 'var(--text-heading)' }}>Security Update</span>
                        <span className="text-muted" style={{ fontSize: '12px' }}>5 hr ago</span>
                      </div>
                      <div className="text-muted" style={{ fontSize: '13px' }}>Password successfully set.</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3 p-3 border-bottom" style={{ borderColor: 'var(--border-color) !important', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0" style={{ width: '36px', height: '36px', backgroundColor: '#6f42c1' }}>
                      <ShoppingCart size={16} />
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className="fw-semibold" style={{ fontSize: '14px', color: 'var(--text-heading)' }}>Invoice #1432</span>
                        <span className="text-muted" style={{ fontSize: '12px' }}>5 hr ago</span>
                      </div>
                      <div className="text-muted" style={{ fontSize: '13px' }}>has been paid Amount: $899.00</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3 p-3" style={{ cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0" style={{ width: '36px', height: '36px', backgroundColor: '#dc3545', fontSize: '16px' }}>
                      R
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className="fw-semibold" style={{ fontSize: '14px', color: 'var(--text-heading)' }}>Emma Smith</span>
                        <span className="text-muted" style={{ fontSize: '12px' }}>5 hr ago</span>
                      </div>
                      <div className="text-muted" style={{ fontSize: '13px' }}>added you to Dashboard Analytics</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 border-top" style={{ borderColor: 'var(--border-color) !important' }}>
                  <button className="btn w-100 rounded-2 fw-medium text-white border-0" style={{ backgroundColor: 'var(--primary)', padding: '8px 0' }}>
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
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
                <Link to="/login" className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none rounded-2 text-danger" onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(220,53,69,0.1)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <LogOut size={16} /> <span style={{ fontSize: '14px' }}>Log Out</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
