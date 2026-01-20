import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = localStorage.getItem('accessToken');
    const userEmail = localStorage.getItem('userEmail');

    if (!accessToken || !userEmail) {
      navigate('/login');
      return;
    }

    // Get user data from localStorage
    const userData = {
      email: userEmail,
      displayName: localStorage.getItem('displayName') || 'User',
      rollNumber: localStorage.getItem('rollNumber') || '',
      outlookAccessToken: localStorage.getItem('outlookAccessToken'),
    };

    setUser(userData);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('displayName');
    localStorage.removeItem('rollNumber');
    localStorage.removeItem('outlookAccessToken');
    localStorage.removeItem('outlookRefreshToken');

    // Redirect to login
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-left">
          <h1 className="app-title">College Cupid</h1>
        </div>
        <div className="navbar-right">
          <div className="user-info">
            <span className="user-name">{user.displayName}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="welcome-section">
          <h2>Welcome, {user.displayName}! 👋</h2>
          <p className="welcome-message">
            You've successfully signed in to College Cupid.
            Start connecting with other students on campus!
          </p>
        </div>

        <div className="user-details-card">
          <h3>Your Profile Information</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{user.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Display Name:</span>
              <span className="detail-value">{user.displayName}</span>
            </div>
            {user.rollNumber && (
              <div className="detail-item">
                <span className="detail-label">Roll Number:</span>
                <span className="detail-value">{user.rollNumber}</span>
              </div>
            )}
            <div className="detail-item">
              <span className="detail-label">Account Status:</span>
              <span className="detail-value status-active">Active</span>
            </div>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💑</div>
            <h4>Find Matches</h4>
            <p>Discover compatible students based on your interests and preferences.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h4>Chat</h4>
            <p>Connect and chat with other verified students on campus.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h4>Smart Matching</h4>
            <p>Our algorithm finds the best matches for you based on multiple factors.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h4>Secure & Private</h4>
            <p>Your data is protected and only visible to verified students.</p>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn primary">
              Complete Your Profile
            </button>
            <button className="action-btn secondary">
              Browse Matches
            </button>
            <button className="action-btn outline">
              View Messages
            </button>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} College Cupid. All rights reserved.</p>
        <p className="footer-links">
          <a href="/privacy">Privacy Policy</a> |
          <a href="/terms">Terms of Service</a> |
          <a href="/support">Support</a>
        </p>
      </footer>
    </div>
  );
};

export default Home;
