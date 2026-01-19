import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../config/authConfig';
import './Login.css';

const Login = () => {
  const { instance } = useMsal();

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRedirectLogin = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>College Cupid</h1>
          <p className="tagline">Find your perfect match on campus</p>
        </div>

        <div className="login-content">
          <h2>Welcome Back!</h2>
          <p className="login-subtitle">Sign in with your Microsoft account to continue</p>

          <div className="login-buttons">
            {/* <button
              className="microsoft-login-btn"
              onClick={handleLogin}
            >
              <svg className="microsoft-icon" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="11" height="11" fill="#F25022"/>
                <rect y="12" width="11" height="11" fill="#00A4EF"/>
                <rect x="12" width="11" height="11" fill="#7FBA00"/>
                <rect x="12" y="12" width="11" height="11" fill="#FFB900"/>
              </svg>
              Sign in with Microsoft
            </button>*/}

            <button
              className="microsoft-login-btn-alt"
              onClick={handleRedirectLogin}
            >
              Sign in with Redirect
            </button>
          </div>

          <div className="login-footer">
            <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
