import React, { useState } from 'react';

const ProfileModal = ({ isOpen, onClose, userInfo, onUpdate }) => {
  const [formData, setFormData] = useState({
    bio: userInfo.bio || '',
    avatar: userInfo.avatar || '',
    rank: userInfo.rank || 'Lead Investigator'
  });

  const [avatarPreview, setAvatarPreview] = useState(userInfo.avatar || '');
  const [isDragging, setIsDragging] = useState(false);
  const [bioCount, setBioCount] = useState(userInfo.bio?.length || 0);
  const MAX_BIO_CHARS = 150;

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'bio') {
      setBioCount(value.length);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview('');
    setFormData(prev => ({ ...prev, avatar: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  const getInitials = () => {
    if (userInfo.fullName) {
      return userInfo.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    return 'DT';
  };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <span className="title-icon">✏️</span>
            <h2>Edit Profile</h2>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          
          {/* ===== EDITABLE SECTION ===== */}
          <div className="form-section editable-section">
            <div className="section-badge">
              <span className="badge-icon">✏️</span>
              <span>Editable Fields</span>
            </div>

            {/* Avatar Upload Section - EDITABLE */}
            <div className="avatar-upload-section">
              <div className="avatar-section-title">
                <h3>Profile Photo</h3>
                <p>Upload a photo to personalize your profile</p>
              </div>
              
              <div className="avatar-upload-container">
                <div 
                  className={`avatar-preview ${isDragging ? 'dragging' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Profile" className="avatar-image" />
                  ) : (
                    <div className="avatar-placeholder">
                      <div className="placeholder-initials">{getInitials()}</div>
                      <div className="placeholder-icon">📸</div>
                      <span>Drag photo here</span>
                    </div>
                  )}
                </div>
                
                <div className="avatar-upload-actions">
                  <div className="upload-buttons">
                    <label className="upload-btn">
                      <span className="btn-icon">📁</span>
                      Choose File
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                    {avatarPreview && (
                      <button 
                        type="button" 
                        className="remove-btn"
                        onClick={handleRemoveAvatar}
                      >
                        <span className="btn-icon">🗑️</span>
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="upload-hint">Recommended: Square JPG or PNG, at least 200x200px</p>
                </div>
              </div>
            </div>

            {/* Bio Section - EDITABLE */}
            <div className="form-group full-width">
              <div className="bio-header">
                <label>Bio <span className="field-editable">(editable)</span></label>
                <span className={`bio-counter ${bioCount > MAX_BIO_CHARS ? 'error' : ''}`}>
                  {bioCount}/{MAX_BIO_CHARS}
                </span>
              </div>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself, your investigation style, and your expertise..."
                rows="4"
                maxLength={MAX_BIO_CHARS}
              />
              <div className="bio-hint">
                <span className="hint-icon">💡</span>
                <span>Share your detective journey, specialties, or favorite cases</span>
              </div>
            </div>

            {/* Rank Section - EDITABLE */}
            <div className="form-group full-width">
              <label>Detective Rank <span className="field-editable">(editable)</span></label>
              <div className="input-wrapper">
                <span className="input-icon">🏆</span>
                <select
                  name="rank"
                  value={formData.rank}
                  onChange={handleChange}
                  className="rank-select"
                >
                  <option value="Lead Investigator">Lead Investigator</option>
                  <option value="Senior Detective">Senior Detective</option>
                  <option value="Detective">Detective</option>
                  <option value="Junior Detective">Junior Detective</option>
                  <option value="Forensic Analyst">Forensic Analyst</option>
                  <option value="Cyber Crime Specialist">Cyber Crime Specialist</option>
                </select>
              </div>
              <span className="input-hint">Your rank is displayed on your profile badge</span>
            </div>
          </div>

          {/* ===== READ-ONLY SECTION ===== */}
          <div className="form-section read-only-section">
            <div className="section-badge">
              <span className="badge-icon">🔒</span>
              <span>Account Information (Read Only)</span>
            </div>
            
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Full Name</span>
                <div className="info-value read-only">
                  <span className="value-icon">👤</span>
                  {userInfo.fullName}
                </div>
              </div>
              <div className="info-item">
                <span className="info-label">Username</span>
                <div className="info-value read-only">
                  <span className="value-icon">@</span>
                  {userInfo.username}
                </div>
              </div>
              <div className="info-item">
                <span className="info-label">Email</span>
                <div className="info-value read-only">
                  <span className="value-icon">📧</span>
                  {userInfo.email}
                </div>
              </div>
              <div className="info-item">
                <span className="info-label">Member Since</span>
                <div className="info-value read-only">
                  <span className="value-icon">📅</span>
                  {userInfo.joinDate}
                </div>
              </div>
            </div>
            
            <div className="read-only-message">
              <span className="message-icon">🔐</span>
              <span>Account details are synced from your registration and cannot be changed.</span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={bioCount > MAX_BIO_CHARS}
            >
              <span className="btn-icon">💾</span>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;