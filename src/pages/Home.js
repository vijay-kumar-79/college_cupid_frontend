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
    email: '',
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
    currentInterest: '',
    photos: []  // Store photo URLs
  });
  const [formStep, setFormStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

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

      if (response.data.success && response.data.userProfile) {
        // Profile exists
        setProfileComplete(true);
        const profile = response.data.userProfile;
        // Transform profilePicUrls to photos array
        const photos = profile.profilePicUrls 
          ? profile.profilePicUrls.map(pic => pic.Url) 
          : [];
        
        setFormData(prev => ({
          ...prev,
          name: profile.name || '',
          gender: profile.gender || '',
          program: profile.program || '',
          yearOfJoin: profile.yearOfJoin || new Date().getFullYear(),
          interests: profile.interests || [],
          sexualOrientation: profile.sexualOrientation || { type: '', display: false },
          relationshipGoals: profile.relationshipGoals || { goal: '', display: false },
          personalityType: profile.personalityType || '',
          publicKey: profile.publicKey || '',
          photos: photos
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

  const handleFeedClick = () => {
    navigate('/feed');
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

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (formData.photos.length + files.length > 6) {
      alert('You can upload a maximum of 6 photos');
      return;
    }

    setUploadingPhoto(true);

    try {
      const accessToken = localStorage.getItem('accessToken');
      const uploadedUrls = [];

      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not a valid image file`);
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`${file.name} is too large (max 10MB)`);
          continue;
        }

        // Create FormData
        const formDataToUpload = new FormData();
        formDataToUpload.append('dp', file);

        console.log('Uploading file:', {
          name: file.name,
          size: file.size,
          type: file.type,
          tokenExists: !!accessToken,
          tokenLength: accessToken?.length
        });

        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/v2/uploadImage`,
          formDataToUpload,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
              // Don't set Content-Type - axios sets it automatically for FormData
            }
          }
        );

        console.log('Upload response:', response.data);

        if (response.data.success) {
          uploadedUrls.push(response.data.imageUrl);
          console.log('Image URL received:', response.data.imageUrl);
        } else {
          console.error('Upload not successful:', response.data);
          alert(`Upload failed: ${response.data.message || 'Unknown error'}`);
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, ...uploadedUrls]
        }));
        alert(`Successfully uploaded ${uploadedUrls.length} photo(s)!`);
      }
    } catch (error) {
      console.error('Full error object:', error);

      // Log the complete error response
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
        console.error('Response data:', error.response.data);
        console.error('Response data stringified:', JSON.stringify(error.response.data, null, 2));

        // Try to get the actual error message
        const errorMessage = error.response.data?.message ||
                            error.response.data?.error ||
                            error.response.data?.details ||
                            error.message;

        console.error('Parsed error message:', errorMessage);

        // Show specific messages based on error
        if (error.response.status === 401) {
          alert('Your session has expired. Please log in again.');
          handleLogout();
        } else if (error.response.status === 413) {
          alert('File too large. Please upload files smaller than 10MB.');
        } else if (error.response.status === 415) {
          alert('Invalid file type. Please upload only images (JPG, PNG, GIF).');
        } else if (error.response.status === 500) {
          // Show the actual server error message if available
          const serverError = error.response.data?.error ||
                             error.response.data?.message ||
                             'Server error. Please try again.';
          alert(`Server error: ${serverError}`);

          // Check for specific backend errors
          if (serverError.includes('disk storage')) {
            alert('Storage error: The server might be out of disk space.');
          } else if (serverError.includes('permission')) {
            alert('Permission error: The server cannot write to the images folder.');
          } else if (serverError.includes('compress')) {
            alert('Image processing error: The server failed to compress the image.');
          }
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('No response from server. Please check your internet connection and ensure the server is running.');
      } else {
        console.error('Request setup error:', error.message);
        alert(`Error: ${error.message}`);
      }
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoDelete = async (photoUrl) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');

      // Extract photoId from URL
      const urlParts = photoUrl.split('photoId=');
      if (urlParts.length < 2) {
        throw new Error('Invalid photo URL');
      }
      const photoId = urlParts[1];

      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/v2/deleteImage/${photoId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      // Remove from local state
      setFormData(prev => ({
        ...prev,
        photos: prev.photos.filter(url => url !== photoUrl)
      }));
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert(`Failed to delete photo: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (formData.interests.length < 5) {
      alert('Please add at least 5 interests');
      return;
    }

    if (formData.photos.length === 0) {
      alert('Please upload at least one photo');
      return;
    }

    if (!formData.publicKey) {
      alert('Please enter your public key');
      return;
    }

    setSubmitting(true);

    try {
      const accessToken = localStorage.getItem('accessToken');
      const userEmail = localStorage.getItem('userEmail');

      // Transform photos array to profilePicUrls format
      const profilePicUrls = formData.photos.map(photoUrl => ({
        Url: photoUrl,
        blurHash: null
      }));

      // Prepare the data to send
      const profileData = {
        ...formData,
        email: userEmail,
        profilePicUrls: profilePicUrls
      };

      // Remove the photos field as it's now in profilePicUrls
      delete profileData.photos;
      delete profileData.currentInterest;

      console.log('Submitting profile data:', profileData);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/v2/user/profile`,
        profileData,
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

        // Optionally reload the profile to get updated data
        checkAuthAndLoadProfile();
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(`Error saving profile: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    // Validation for each step
    if (formStep === 1) {
      if (!formData.name.trim()) {
        alert('Please enter your name');
        return;
      }
      if (!formData.gender) {
        alert('Please select your gender');
        return;
      }
      if (!formData.program) {
        alert('Please select your program');
        return;
      }
      if (!formData.yearOfJoin) {
        alert('Please enter your year of join');
        return;
      }
    } else if (formStep === 2) {
      if (!formData.publicKey.trim()) {
        alert('Please enter your public key');
        return;
      }
    } else if (formStep === 3) {
      if (formData.interests.length < 5) {
        alert('Please add at least 5 interests');
        return;
      }
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
            {formData.photos && formData.photos.length > 0 && (
              <div className="navbar-avatar">
                <img src={formData.photos[0]} alt="Profile" className="navbar-avatar-image" />
              </div>
            )}
            <span className="user-name">{user?.displayName || 'User'}</span>
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
            <h2>Welcome back, {formData.name || user?.displayName || 'User'}! 👋</h2>
            <p className="welcome-message">
              Your profile is complete! Start exploring matches and connecting with other students.
            </p>

            <div className="profile-summary">
              <div className="summary-card">
                <h3>Your Profile Summary</h3>
                
                {/* Photo Gallery */}
                {formData.photos && formData.photos.length > 0 && (
                  <div className="profile-photo-gallery">
                    {formData.photos.map((photoUrl, index) => (
                      <div key={index} className="profile-gallery-photo">
                        <img src={photoUrl} alt={`Profile ${index + 1}`} />
                        {index === 0 && <span className="main-photo-badge">Main</span>}
                      </div>
                    ))}
                  </div>
                )}

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
                <button
                  className="dashboard-btn"
                  onClick={() => setShowProfileForm(true)}
                >
                  <span className="btn-icon">👤</span>
                  <span className="btn-text">Edit Profile</span>
                </button>
                <button className="dashboard-btn" onClick={handleFeedClick}>
                  <span className="btn-icon">💑</span>
                  <span className="btn-text">Find Matches</span>
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
              <h2>{profileComplete ? 'Edit Your Profile' : 'Complete Your Profile'}</h2>
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
                <div className="step-line"></div>
                <div className={`step ${formStep >= 4 ? 'active' : ''}`}>
                  <span className="step-number">4</span>
                  <span className="step-text">Photos</span>
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
                      type="button"
                      onClick={nextStep}
                      disabled={formData.interests.length < 5}
                      className="btn-next"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {formStep === 4 && (
                <div className="form-step">
                  <h3>Upload Photos</h3>
                  <p className="form-description">
                    Add 1-6 photos to your profile. Your first photo will be your main profile picture.
                  </p>

                  <div className="photo-upload-container">
                    <div className="photos-grid">
                      {formData.photos.map((photoUrl, index) => (
                        <div key={index} className="photo-item">
                          <img
                            src={photoUrl}
                            alt={`Upload ${index + 1}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150x150?text=Image+Error';
                            }}
                          />
                          {index === 0 && <span className="main-badge">Main</span>}
                          <button
                            type="button"
                            onClick={() => handlePhotoDelete(photoUrl)}
                            className="delete-photo-btn"
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      {formData.photos.length < 6 && (
                        <div className="photo-upload-box">
                          <input
                            type="file"
                            id="photo-upload"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoUpload}
                            disabled={uploadingPhoto}
                            style={{ display: 'none' }}
                          />
                          <label htmlFor="photo-upload" className="upload-label">
                            {uploadingPhoto ? (
                              <>
                                <span className="spinner-small"></span>
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <span className="upload-icon">📷</span>
                                <span>Add Photo</span>
                              </>
                            )}
                          </label>
                        </div>
                      )}
                    </div>

                    <small className="form-help">
                      {formData.photos.length}/6 photos uploaded. JPG, PNG, or GIF. Max 10MB per photo.
                    </small>
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
                      disabled={submitting || formData.photos.length === 0}
                      className="btn-submit"
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-small"></span>
                          Saving...
                        </>
                      ) : (
                        profileComplete ? 'Update Profile' : 'Complete Profile'
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
