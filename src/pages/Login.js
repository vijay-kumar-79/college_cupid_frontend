import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const handleMicrosoftLogin = () => {
    // Direct redirect to backend Microsoft login endpoint
    window.location.href = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/auth/microsoft`;
  };

  // Check if user is returning from auth with query parameters
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const outlookInfo = params.get('outlookInfo');

    if (status && outlookInfo) {
      try {
        const parsedInfo = JSON.parse(outlookInfo);

        if (status === 'SUCCESS') {
          // Store authentication data
          localStorage.setItem('accessToken', parsedInfo.accessToken);
          localStorage.setItem('refreshToken', parsedInfo.refreshToken);
          localStorage.setItem('userEmail', parsedInfo.email);
          localStorage.setItem('displayName', parsedInfo.displayName || '');
          localStorage.setItem('rollNumber', parsedInfo.rollNumber || '');
          localStorage.setItem('outlookAccessToken', parsedInfo.outlookAccessToken);
          localStorage.setItem('outlookRefreshToken', parsedInfo.outlookRefreshToken);

          // Redirect to home/dashboard
          navigate('/home');
        } else {
          // Handle error
          navigate('/login?error=auth_failed');
        }
      } catch (error) {
        console.error('Error parsing auth data:', error);
        navigate('/login?error=parsing_error');
      }
    }
  }, [navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="app-title">College Cupid</h1>
          <p className="app-tagline">Find your perfect match on campus</p>
        </div>

        <div className="login-content">
          <h2 className="welcome-title">Welcome Back!</h2>
          <p className="login-subtitle">
            Sign in with your institutional Microsoft account to continue
          </p>

          <div className="login-buttons">
            <button
              className="microsoft-login-btn"
              onClick={handleMicrosoftLogin}
            >
              <svg
                className="microsoft-icon"
                width="20"
                height="20"
                viewBox="0 0 23 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="11" height="11" fill="#F25022"/>
                <rect y="12" width="11" height="11" fill="#00A4EF"/>
                <rect x="12" width="11" height="11" fill="#7FBA00"/>
                <rect x="12" y="12" width="11" height="11" fill="#FFB900"/>
              </svg>
              Sign in with Microsoft
            </button>
          </div>

          <div className="login-info">
            <div className="info-item">
              <span className="info-icon">🎓</span>
              <span>Use your college email address</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🔒</span>
              <span>Secure authentication via Microsoft</span>
            </div>
            <div className="info-item">
              <span className="info-icon">❤️</span>
              <span>Connect with verified students only</span>
            </div>
          </div>

          <div className="login-footer">
            <p className="terms-text">
              By signing in, you agree to our
              <a href="/terms"> Terms of Service</a> and
              <a href="/privacy"> Privacy Policy</a>
            </p>
            <p className="support-text">
              Need help? <a href="/support">Contact Support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
