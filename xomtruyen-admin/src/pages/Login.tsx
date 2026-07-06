import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import loginIllustration from '../assets/login.svg';
import { Link } from 'react-router-dom';

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="page-layout justify-content-center">
      <div className="auth-wrapper min-vh-100 px-2" style={{ backgroundColor: '#f4f6fa' }}>
        <div className="row g-0 min-vh-100">
          <div className="col-xl-5 col-lg-6 ms-auto px-sm-4 align-self-center py-4 d-none d-lg-block">
            <img src={loginIllustration} alt="" className="img-fluid" />
          </div>
          <div className="col-xl-5 col-lg-6 ms-auto px-sm-4 align-self-center py-4">
            <div className="card card-body p-4 p-sm-5 m-auto rounded-4" style={{ maxWidth: '500px' }}>
              <div className="mb-4 text-center">
                <Link to="/" aria-label="NexLink logo" className="text-decoration-none">
                  <div className="brand-icon mx-auto" style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="9" y1="3" x2="9" y2="21"></line>
                      <line x1="15" y1="3" x2="15" y2="21"></line>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="3" y1="15" x2="21" y2="15"></line>
                    </svg>
                  </div>
                </Link>
              </div>
              <div className="text-center mb-4">
                <h5 className="mb-1 fw-bold">Welcome to NexLink</h5>
                <p className="text-muted" style={{ fontSize: '14px' }}>Sign in to access your secure admin dashboard.</p>
              </div>
              <form>
                <div className="mb-4">
                  <label className="form-label" htmlFor="loginEmail">Email Address</label>
                  <input type="email" className="form-control" id="loginEmail" placeholder="info@example.com" />
                </div>
                <div className="mb-4">
                  <label className="form-label" htmlFor="loginPassword">Password</label>
                  <div className="password-wrapper position-relative">
                    <input type={showPassword ? "text" : "password"} className="form-control password-input pe-5" id="loginPassword" placeholder="********" />
                    <button
                      type="button"
                      className="btn border-0 position-absolute end-0 top-50 translate-middle-y text-muted px-3"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ background: 'transparent' }}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <Link to="/" className="btn btn-primary waves-effect waves-light w-100">
                    Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};