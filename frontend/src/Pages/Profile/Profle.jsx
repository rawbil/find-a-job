import React, { useState } from 'react';
import './Profile.css';

export default function ProfileForm({ user, setHasProfile }) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    skills: '',
    phone: '',
    whatsapp: '',
    facebook: '',
    photo: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, photo: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    const updatedUser = { ...user, profile: formData };
    localStorage.setItem(user.username, JSON.stringify(updatedUser));
    setHasProfile(true);
  };

  return (
    <div className="profile-form">
      <h2>Create Profile</h2>

      <div className="avatar-container">
        <label htmlFor="photo-upload" className="avatar-label">
          {formData.photo ? (
            <img src={formData.photo} alt="Profile" className="avatar" />
          ) : (
            <div className="avatar-placeholder">
              <span className="camera-icon">📷</span>
            </div>
          )}
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          capture="user"
          onChange={handlePhotoUpload}
          style={{ display: 'none' }}
        />
      </div>

      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="location" placeholder="Location" onChange={handleChange} />
      <textarea name="skills" placeholder="Skills" onChange={handleChange}></textarea>
      <input name="phone" placeholder="Phone Number" onChange={handleChange} />
      <input name="whatsapp" placeholder="WhatsApp Number" onChange={handleChange} />
      <input name="facebook" placeholder="Facebook Profile (optional)" onChange={handleChange} />
      <button onClick={saveProfile}>Create Profile</button>
    </div>
  );
}
