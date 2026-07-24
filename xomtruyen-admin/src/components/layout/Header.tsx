import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Calendar, ChevronsLeft, Moon, Sun, ClipboardList, ChevronDown, User, Settings, ArrowUpCircle, LogOut, Lock, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
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
  const [language, setLanguage] = useState('VI');
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
    <header className="app-header">
      <div className="app-header-inner">
        <button
          onClick={toggleSidebar}
          className="app-toggler"
          type="button"
          aria-label="app toggler"
        >
          <ChevronsLeft size={16} style={{ transform: isSidebarCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        <div className="app-header-start d-none d-md-flex">
          <form className="d-flex align-items-center h-100 w-lg-250px w-xxl-300px position-relative">
            <button type="button" className="btn btn-sm border-0 position-absolute start-0 ms-3 p-0">
              <Search size={16} className="text-muted" />
            </button>
            <input type="text" className="form-control form-control-fill ps-5" placeholder="Search anything's" />
          </form>
          <div className="badge-standard d-none d-lg-inline-block ms-4">
            Today New Leads
            <span className="badge bg-primary-subtle text-primary ms-2">27</span>
          </div>
        </div>

        <div className="app-header-end">
          <div className="px-lg-4 px-2 ps-0 d-flex align-items-center">
            <div
              onClick={(e) => { e.preventDefault(); toggleTheme(theme === 'light' ? 'dark' : 'light'); }}
              className="d-flex align-items-center position-relative"
              style={{
                width: '64px',
                height: '32px',
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'var(--bs-gray-200)',
                borderRadius: '32px',
                cursor: 'pointer',
                padding: '3px'
              }}
            >
              <div
                className="position-absolute shadow-sm"
                style={{
                  width: '26px',
                  height: '26px',
                  backgroundColor: theme === 'dark' ? '#2b2f32' : '#ffffff',
                  borderRadius: '50%',
                  transition: 'transform 0.3s ease',
                  transform: theme === 'dark' ? 'translateX(32px)' : 'translateX(0)',
                  left: '3px',
                  zIndex: 0
                }}
              />
              <div className="w-50 d-flex justify-content-center position-relative" style={{ zIndex: 1 }}>
                <Sun size={14} color={theme === 'dark' ? '#adb5bd' : '#ffc107'} />
              </div>
              <div className="w-50 d-flex justify-content-center position-relative" style={{ zIndex: 1 }}>
                <Moon size={14} color={theme === 'dark' ? '#ffffff' : '#adb5bd'} />
              </div>
            </div>
          </div>
          <div className="vr my-3"></div>
          <div className="d-flex align-items-center gap-sm-2 gap-0 px-sm-2 px-1">

            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                id="dropdown-language"
                className="btn btn-icon text-decoration-none shadow-none d-flex align-items-center justify-content-center border-0 p-0"
                style={{ width: '40px', height: '40px' }}
              >
                <span className="fw-medium text-muted" style={{ fontSize: '14px' }}>{language}</span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-sm border-0 dropdown-menu-lg-end mt-2" style={{ minWidth: '80px' }}>
                <Dropdown.Item href="#" onClick={(e) => { e.preventDefault(); setLanguage('VI'); }} className="text-center" style={{ fontSize: '13px' }}>VI</Dropdown.Item>
                <Dropdown.Item href="#" onClick={(e) => { e.preventDefault(); setLanguage('EN'); }} className="text-center" style={{ fontSize: '13px' }}>EN</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                id="dropdown-notification"
                className="btn btn-icon text-decoration-none shadow-none p-0 d-flex align-items-center justify-content-center position-relative border-0"
                style={{ width: '40px', height: '40px' }}
              >
                <Bell size={20} className="text-muted" />
                <span className="position-absolute top-0 end-0 p-1 mt-1 me-1 bg-primary border border-3 border-light rounded-circle"></span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-menu-lg-end p-0 w-300px mt-2 shadow-lg border-0" style={{ minWidth: '340px' }}>
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
              </Dropdown.Menu>
            </Dropdown>

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
                  <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Profile" className="avatar rounded-circle border flex-shrink-0" style={{ width: '40px', height: '40px', objectFit: 'cover', borderColor: 'var(--border-color)' }} />
                  <span className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-2" style={{ width: '10px', height: '10px', right: '0', borderColor: 'var(--bg-header)' }}></span>
                </div>
              </div>

              {isProfileOpen && (
                <div className="position-absolute end-0 mt-3 rounded-3 shadow-lg" style={{ width: '240px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', zIndex: 1050 }}>
                  <div className="p-3 border-bottom" style={{ borderColor: 'var(--border-color) !important' }}>
                    <div className="d-flex align-items-center gap-3">
                      <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Profile" className="rounded-circle flex-shrink-0" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
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
        </div>
      </div>
    </header>
  );
};
