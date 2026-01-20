import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email:'',
    gender: '',
    program: '',
    yearOfJoin: new Date().getFullYear(),
    interests: [],
    sexualOrientation: {
      type: '',
      display: false
    },
    relationshipGoals: {
      goal: '',
      display: false
    },
    personalityType: '',
    publicKey: '',
    currentInterest: ''
  });
  const [formStep, setFormStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);

  // Available options for dropdowns
  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
  const programOptions = ['B.Tech', 'M.Tech', 'PhD', 'MBA', 'B.Sc', 'M.Sc', 'Other'];
  const sexualOrientationOptions = ['Straight', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 'Asexual', 'Queer', 'Questioning', 'Other'];
  const relationshipGoalOptions = ['Long-term relationship', 'Casual dating', 'Friendship', 'Not sure yet', 'Just exploring'];
  const personalityTypeOptions = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
  const interestSuggestions = [
    'Music', 'Movies', 'Gaming', 'Reading', 'Cooking', 'Traveling',
    'Sports', 'Photography', 'Art', 'Dancing', 'Hiking', 'Yoga',
    'Programming', 'Science', 'Technology', 'Fashion', 'Food',
    'Animals', 'Politics', 'Environment', 'Fitness', 'Meditation'
  ];

  useEffect(() => {
    checkAuthAndLoadProfile();
  }, []);

  const checkAuthAndLoadProfile = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const userEmail = localStorage.getItem('userEmail');

    if (!accessToken || !userEmail) {
      navigate('/login');
      return;
    }

    const userData = {
      email: userEmail,
      displayName: localStorage.getItem('displayName') || 'User',
      rollNumber: localStorage.getItem('rollNumber') || '',
    };

    setUser(userData);

    // Check if profile already exists
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/v2/user/profile/email/${userEmail}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      // console.log(response)
      if (response.data.success && response.data.userProfile) {
        // Profile exists
        setProfileComplete(true);
        setFormData(prev => ({
          ...prev,
          ...response.data.userProfile,
          interests: response.data.userProfile.interests || []
        }));
      }
    } catch (error) {
      console.log('Profile not found or error:', error);
      // Profile doesn't exist yet
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleInterestAdd = () => {
    if (formData.currentInterest.trim() && !formData.interests.includes(formData.currentInterest.trim())) {
      if (formData.interests.length < 20) {
        setFormData(prev => ({
          ...prev,
          interests: [...prev.interests, prev.currentInterest.trim()],
          currentInterest: ''
        }));
      }
    }
  };

  const handleInterestRemove = (interestToRemove) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const handleInterestSuggestionClick = (suggestion) => {
    if (!formData.interests.includes(suggestion) && formData.interests.length < 20) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, suggestion]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.interests.length < 5) {
      alert('Please add at least 5 interests');
      return;
    }

    const userEmail = localStorage.getItem('userEmail');
    setFormData(prev => ({
      ...prev,
      email: userEmail
    }));
    console.log(formData)
    setSubmitting(true);

    // // Debug: Check token
    const accessToken = localStorage.getItem('accessToken');
    // console.log('Access Token exists:', !!accessToken);
    // console.log('Token length:', accessToken?.length);
    // console.log('Token first 50 chars:', accessToken?.substring(0, 50) + '...');

    // // Check if token is a JWT
    // if (accessToken) {
    //   try {
    //     const payload = JSON.parse(atob(accessToken.split('.')[1]));
    //     console.log('Token payload:', payload);
    //     console.log('Token email:', payload.email);
    //     console.log('Token exp:', new Date(payload.exp * 1000));
    //   } catch (err) {
    //     console.log('Token parsing error:', err);
    //   }
    // }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/v2/user/profile`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Response:', response);

      if (response.data.success) {
        setProfileComplete(true);
        setShowProfileForm(false);
        alert('Profile saved successfully!');
      }
    } catch (error) {
      // console.error('Error saving profile:', error);
      // console.error('Error response:', error.response?.data);
      // console.error('Error status:', error.response?.status);
      // console.error('Error headers:', error.response?.headers);
      alert(`Error saving profile: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (formStep === 1 && (!formData.name || !formData.gender || !formData.program || !formData.yearOfJoin)) {
      alert('Please fill all required fields');
      return;
    }
    setFormStep(prev => prev + 1);
  };

  const prevStep = () => {
    setFormStep(prev => prev - 1);
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
        {!profileComplete && !showProfileForm && (
          <div className="profile-complete-cta">
            <div className="cta-card">
              <h2>Welcome to College Cupid! 🎉</h2>
              <p className="cta-text">
                Complete your profile to start connecting with other students on campus.
                Your profile helps us find the best matches for you.
              </p>
              <div className="profile-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '0%' }}></div>
                </div>
                <span className="progress-text">Profile 0% complete</span>
              </div>
              <button
                onClick={() => setShowProfileForm(true)}
                className="cta-button"
              >
                Complete Your Profile
              </button>
              <p className="cta-note">
                This will only take a few minutes!
              </p>
            </div>
          </div>
        )}

        {profileComplete && (
          <div className="welcome-section">
            <h2>Welcome back, {formData.name || user.displayName}! 👋</h2>
            <p className="welcome-message">
              Your profile is complete! Start exploring matches and connecting with other students.
            </p>

            <div className="profile-summary">
              <div className="summary-card">
                <h3>Your Profile Summary</h3>
                <div className="summary-details">
                  <div className="summary-item">
                    <span className="summary-label">Program:</span>
                    <span className="summary-value">{formData.program}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Year of Join:</span>
                    <span className="summary-value">{formData.yearOfJoin}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Interests:</span>
                    <div className="interests-tags">
                      {formData.interests.slice(0, 5).map((interest, index) => (
                        <span key={index} className="interest-tag">{interest}</span>
                      ))}
                      {formData.interests.length > 5 && (
                        <span className="interest-tag">+{formData.interests.length - 5} more</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-actions">
              <h3>What would you like to do?</h3>
              <div className="action-grid">
                <button className="dashboard-btn">
                  <span className="btn-icon">👤</span>
                  <span className="btn-text">Edit Profile</span>
                </button>
                <button className="dashboard-btn">
                  <span className="btn-icon">💑</span>
                  <span className="btn-text" >Find Matches</span>
                </button>
                <button className="dashboard-btn">
                  <span className="btn-icon">💬</span>
                  <span className="btn-text">View Messages</span>
                </button>
                <button className="dashboard-btn">
                  <span className="btn-icon">⚙️</span>
                  <span className="btn-text">Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {showProfileForm && (
          <div className="profile-form-container">
            <div className="form-header">
              <h2>Complete Your Profile</h2>
              <div className="form-steps">
                <div className={`step ${formStep >= 1 ? 'active' : ''}`}>
                  <span className="step-number">1</span>
                  <span className="step-text">Basic Info</span>
                </div>
                <div className="step-line"></div>
                <div className={`step ${formStep >= 2 ? 'active' : ''}`}>
                  <span className="step-number">2</span>
                  <span className="step-text">Preferences</span>
                </div>
                <div className="step-line"></div>
                <div className={`step ${formStep >= 3 ? 'active' : ''}`}>
                  <span className="step-number">3</span>
                  <span className="step-text">Interests</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
              {formStep === 1 && (
                <div className="form-step">
                  <h3>Basic Information</h3>
                  <div className="form-group">
                    <label htmlFor="name">
                      Full Name *
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </label>
                  </div>

                  <div className="form-group">
                    <label htmlFor="gender">
                      Gender *
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select gender</option>
                        {genderOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="program">
                        Program *
                        <select
                          id="program"
                          name="program"
                          value={formData.program}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select program</option>
                          {programOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="form-group">
                      <label htmlFor="yearOfJoin">
                        Year of Join *
                        <input
                          type="number"
                          id="yearOfJoin"
                          name="yearOfJoin"
                          value={formData.yearOfJoin}
                          onChange={handleInputChange}
                          min="2000"
                          max={new Date().getFullYear()}
                          required
                        />
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="personalityType">
                      Personality Type (Optional)
                      <select
                        id="personalityType"
                        name="personalityType"
                        value={formData.personalityType}
                        onChange={handleInputChange}
                      >
                        <option value="">Select personality type</option>
                        {personalityTypeOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn-next"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {formStep === 2 && (
                <div className="form-step">
                  <h3>Preferences</h3>

                  <div className="form-group">
                    <label htmlFor="sexualOrientation.type">
                      Sexual Orientation
                      <select
                        id="sexualOrientation.type"
                        name="sexualOrientation.type"
                        value={formData.sexualOrientation.type}
                        onChange={handleInputChange}
                      >
                        <option value="">Select sexual orientation</option>
                        {sexualOrientationOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="sexualOrientation.display"
                        name="sexualOrientation.display"
                        checked={formData.sexualOrientation.display}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="sexualOrientation.display">
                        Show on profile
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="relationshipGoals.goal">
                      Relationship Goals
                      <select
                        id="relationshipGoals.goal"
                        name="relationshipGoals.goal"
                        value={formData.relationshipGoals.goal}
                        onChange={handleInputChange}
                      >
                        <option value="">Select relationship goal</option>
                        {relationshipGoalOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="relationshipGoals.display"
                        name="relationshipGoals.display"
                        checked={formData.relationshipGoals.display}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="relationshipGoals.display">
                        Show on profile
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="publicKey">
                      Public Key *
                      <input
                        type="text"
                        id="publicKey"
                        name="publicKey"
                        value={formData.publicKey}
                        onChange={handleInputChange}
                        placeholder="Enter your public key"
                        required
                      />
                      <small className="form-help">
                        This is required for secure communication
                      </small>
                    </label>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="btn-prev"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn-next"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {formStep === 3 && (
                <div className="form-step">
                  <h3>Interests</h3>
                  <p className="form-description">
                    Add 5-20 interests that describe you. This helps us find better matches!
                  </p>

                  <div className="interests-container">
                    <div className="current-interests">
                      <h4>Your Interests ({formData.interests.length}/20)</h4>
                      {formData.interests.length === 0 ? (
                        <p className="no-interests">No interests added yet</p>
                      ) : (
                        <div className="interests-tags">
                          {formData.interests.map((interest, index) => (
                            <span key={index} className="interest-tag removable">
                              {interest}
                              <button
                                type="button"
                                onClick={() => handleInterestRemove(interest)}
                                className="remove-tag"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="add-interest">
                      <div className="interest-input-group">
                        <input
                          type="text"
                          value={formData.currentInterest}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            currentInterest: e.target.value
                          }))}
                          placeholder="Add an interest"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleInterestAdd();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleInterestAdd}
                          disabled={!formData.currentInterest.trim() || formData.interests.length >= 20}
                          className="add-interest-btn"
                        >
                          Add
                        </button>
                      </div>
                      <small className="form-help">
                        Press Enter or click Add to include an interest
                      </small>
                    </div>

                    <div className="interest-suggestions">
                      <h4>Popular Interests</h4>
                      <div className="suggestion-tags">
                        {interestSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleInterestSuggestionClick(suggestion)}
                            disabled={formData.interests.includes(suggestion) || formData.interests.length >= 20}
                            className="suggestion-tag"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="btn-prev"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || formData.interests.length < 5}
                      className="btn-submit"
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-small"></span>
                          Saving...
                        </>
                      ) : (
                        'Complete Profile'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
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
