import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Feed.css';

function Feed() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchAllOthers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchAllOthers = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    const userEmail = localStorage.getItem('userEmail');

    if (!accessToken || !userEmail) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/v2/user/profile/page/${currentPage}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      if (response.data.success) {
        setUsers(response.data.users || []);
        setHasMore(response.data.totalCount === 10);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleGoHome = () => {
    navigate('/home');
  };

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="feed-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <h1 className="app-title">College Cupid Feed</h1>
        </div>
        <div className="navbar-right">
          <div className="user-info">
            <span className="user-name">{localStorage.getItem('displayName') || 'User'}</span>
            <button onClick={handleGoHome} className="home-btn">Home</button>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="feed-header">
          <h2>Discover People</h2>
          <p className="feed-subtitle">Connect with people sorted by personality compatibility</p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading feed...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="no-users-container">
            <div className="no-users-card">
              <div className="no-users-icon">👥</div>
              <h3>No Users Found</h3>
              <p>Check back later for new profiles or try adjusting your preferences.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Users Grid */}
            <div className="users-grid">
              {users.map((user, index) => (
                <div key={user._id || index} className="user-card">
                  {/* Photo Gallery */}
                  {user.profilePicUrls && user.profilePicUrls.length > 0 && (
                    <div className="user-photo-gallery">
                      {user.profilePicUrls.slice(0, 6).map((pic, idx) => (
                        pic.Url && (
                          <div key={idx} className="gallery-photo">
                            <img src={pic.Url} alt={`${user.name || 'User'} ${idx + 1}`} />
                            {idx === 0 && <span className="main-photo-badge">Main</span>}
                            {idx === 5 && user.profilePicUrls.length > 6 && (
                              <div className="more-photos-overlay">
                                +{user.profilePicUrls.length - 6}
                              </div>
                            )}
                          </div>
                        )
                      ))}
                    </div>
                  )}

                  <div className="user-card-header">
                    {user.profilePicUrls && user.profilePicUrls.length > 0 && user.profilePicUrls[0].Url ? (
                      <div className="user-avatar">
                        <img src={user.profilePicUrls[0].Url} alt={user.name || 'User'} className="avatar-image" />
                      </div>
                    ) : (
                      <div className="user-avatar">
                        {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                    <div className="user-basic-info">
                      <h4 className="user-name">{user.name || 'Anonymous'}</h4>
                      {user.personalityType && (
                        <span className="personality-badge">{user.personalityType}</span>
                      )}
                    </div>
                  </div>

                  <div className="user-card-body">
                    <div className="user-detail">
                      <span className="detail-label">Gender:</span>
                      <span className="detail-value">{user.gender || 'Not specified'}</span>
                    </div>

                    <div className="user-detail">
                      <span className="detail-label">Program:</span>
                      <span className="detail-value">{user.program || 'Not specified'}</span>
                    </div>

                    <div className="user-detail">
                      <span className="detail-label">Year of Join:</span>
                      <span className="detail-value">{user.yearOfJoin || 'Not specified'}</span>
                    </div>

                    {user.sexualOrientation?.display && user.sexualOrientation?.type && (
                      <div className="user-detail">
                        <span className="detail-label">Orientation:</span>
                        <span className="detail-value">{user.sexualOrientation.type}</span>
                      </div>
                    )}

                    {user.relationshipGoals?.display && user.relationshipGoals?.goal && (
                      <div className="user-detail">
                        <span className="detail-label">Looking for:</span>
                        <span className="detail-value">{user.relationshipGoals.goal}</span>
                      </div>
                    )}

                    {user.interests && user.interests.length > 0 && (
                      <div className="user-interests">
                        <span className="detail-label">Interests:</span>
                        <div className="interests-tags">
                          {user.interests.slice(0, 5).map((interest, idx) => (
                            <span key={idx} className="interest-tag">{interest}</span>
                          ))}
                          {user.interests.length > 5 && (
                            <span className="interest-tag more">+{user.interests.length - 5} more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="user-card-footer">
                    <button className="btn-view-profile">View Profile</button>
                    <button className="btn-connect">Connect</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="pagination-btn"
              >
                ← Previous
              </button>

              <span className="page-indicator">Page {currentPage + 1}</span>

              <button
                onClick={handleNextPage}
                disabled={!hasMore}
                className="pagination-btn"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 College Cupid. All rights reserved.</p>
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/contact">Contact</a>
        </div>
      </footer>
    </div>
  );
}

export default Feed;