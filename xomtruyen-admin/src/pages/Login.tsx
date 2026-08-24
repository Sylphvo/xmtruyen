import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import loginIllustration from '../assets/login.svg';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { apiClient } from '../api/userApi';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, login } = useAuth();

  const from = location.state?.from?.pathname || '/';

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Vui lòng nhập email và mật khẩu');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response: any = await apiClient.post('/auth/login', { email, password });
      if (response && response.success === false) {
        throw new Error(response.message || 'Đăng nhập thất bại.');
      }
      
      const { token, refreshToken } = response.data;
      if (!token) throw new Error('Không nhận được token từ máy chủ.');
      
      login(token, refreshToken);
      toast.success('Đăng nhập thành công');
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.', {
        position: 'top-right',
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 w-100 d-flex" style={{ backgroundColor: '#f4f6fa' }}>
      <div className="container-fluid min-vh-100 px-0">
        <div className="row g-0 min-vh-100 align-items-center justify-content-center w-100">
          {/* Left Column - Illustration */}
          <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center p-5">
            <img src={loginIllustration} alt="Login Illustration" className="img-fluid" style={{ maxWidth: '80%' }} />
          </div>
          
          {/* Right Column - Login Form */}
          <div className="col-lg-6 d-flex justify-content-center align-items-center p-3 p-md-5">
            <div className="card border-0 shadow-sm p-4 p-sm-5 rounded-4 w-100" style={{ maxWidth: '420px', backgroundColor: '#fff' }}>
              <div className="mb-4 text-center">
                <Link to="/" aria-label="NexLink logo" className="text-decoration-none">
                  <div className="brand-icon mx-auto mb-3" style={{ width: '48px', height: '48px', backgroundColor: 'var(--bs-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="9" y1="3" x2="9" y2="21"></line>
                      <line x1="15" y1="3" x2="15" y2="21"></line>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="3" y1="15" x2="21" y2="15"></line>
                    </svg>
                  </div>
                </Link>
                <h4 className="mb-1 fw-bold" style={{ color: '#172b4d' }}>Welcome to NexLink</h4>
                <p className="text-muted small mb-0">Sign in to access your secure admin dashboard.</p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-medium" htmlFor="loginEmail" style={{ color: '#42526e' }}>Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control form-control-lg fs-6" id="loginEmail" placeholder="info@example.com" style={{ backgroundColor: '#fafbfc', borderColor: '#dfe1e6' }} />
                </div>
                
                <div className="mb-3">
                  <label className="form-label small fw-medium" htmlFor="loginPassword" style={{ color: '#42526e' }}>Password</label>
                  <div className="password-wrapper position-relative">
                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="form-control form-control-lg fs-6 pe-5" id="loginPassword" placeholder="********" style={{ backgroundColor: '#fafbfc', borderColor: '#dfe1e6' }} />
                    <button
                      type="button"
                      className="btn border-0 position-absolute end-0 top-50 translate-middle-y text-muted px-3"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ background: 'transparent' }}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="rememberMe" style={{ borderColor: '#dfe1e6' }} />
                    <label className="form-check-label small text-muted" htmlFor="rememberMe">
                      Remember Me
                    </label>
                  </div>
                  <Link to="#" className="small text-decoration-none" style={{ color: 'var(--bs-primary)' }}>Forgot Password?</Link>
                </div>

                <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg w-100 fs-6 fw-medium mb-3" style={{ padding: '12px' }}>
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </button>

                <div className="text-center mb-4">
                  <span className="small text-muted">Don't have an account? </span>
                  <Link to="#" className="small text-decoration-none" style={{ color: 'var(--bs-primary)' }}>Sign Up here</Link>
                </div>

                <div className="position-relative mb-4 text-center">
                  <hr className="text-muted opacity-25" />
                  <span className="position-absolute top-50 start-50 translate-middle px-2 small text-muted" style={{ backgroundColor: '#fff' }}>
                    Or Continue With
                  </span>
                </div>

                <button type="button" className="btn btn-light btn-lg w-100 fs-6 d-flex justify-content-center align-items-center fw-medium border" style={{ backgroundColor: '#fafbfc', borderColor: '#dfe1e6', color: '#42526e', padding: '12px' }}>
                  <svg className="me-2" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Login with Google
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
