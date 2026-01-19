import React from 'react';
import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { graphConfig } from '../config/authConfig';
import './Dashboard.css';

const Dashboard = () => {
  const { instance, accounts } = useMsal();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const account = accounts[0];
        const response = await instance.acquireTokenSilent({
          scopes: ["User.Read"],
          account: account
        });

        const graphResponse = await fetch(graphConfig.graphMeEndpoint, {
          headers: {
            Authorization: `Bearer ${response.accessToken}`
          }
        });

        const data = await graphResponse.json();
        console.log(data);
        setUserData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    if (accounts.length > 0) {
      fetchUserData();
    }
  }, [accounts, instance]);

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "/",
      mainWindowRedirectUri: "/"
    });
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-content">
          <h1 className="brand">College Cupid</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <div className="profile-card">
            <div className="profile-header">
              <div className="avatar">
                {userData?.displayName?.charAt(0) || 'U'}
              </div>
              <div className="profile-info">
                <h2>Welcome, {userData?.displayName || accounts[0]?.name}! 👋</h2>
                <p className="email">{userData?.mail || userData?.userPrincipalName}</p>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Job Title:</span>
                <span className="detail-value">{userData?.jobTitle || 'Student'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Office Location:</span>
                <span className="detail-value">{userData?.officeLocation || 'Not specified'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Mobile Phone:</span>
                <span className="detail-value">{userData?.mobilePhone || 'Not specified'}</span>
              </div>
            </div>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💝</div>
              <h3>Find Matches</h3>
              <p>Discover compatible students on your campus</p>
              <button className="feature-btn">Start Matching</button>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Messages</h3>
              <p>Chat with your connections</p>
              <button className="feature-btn">View Messages</button>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚙️</div>
              <h3>Settings</h3>
              <p>Customize your profile and preferences</p>
              <button className="feature-btn">Edit Profile</button>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Activity</h3>
              <p>See your recent activity and stats</p>
              <button className="feature-btn">View Activity</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
