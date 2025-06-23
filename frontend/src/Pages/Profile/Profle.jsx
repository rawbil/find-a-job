import React, { useState } from 'react';
import './Profile.css';
import { AxiosError } from 'axios';
import { createUserProfileService } from '../../../utils/services/profile.service';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ProfileForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',  
    location: '',
    skills: '',
    phoneNumber: '',
    profileImage: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, profileImage: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

 const saveProfile = async () => {
  setLoading(true);
  setError('');
  try {
    // Convert skills string to array
    const payload = {
      ...formData,
      skills: typeof formData.skills === "string"
        ? formData.skills.split(',').map(skill => skill.trim()).filter(Boolean)
        : formData.skills
    };
    const response = await createUserProfileService(payload);
    if (response.success) {
      toast.success(response.message);
      navigate('/')
    } else {
      toast.error(response.message);
      setError(response.message);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      setError(error.message);
    } else {
      setError("An unexpected error occurred when creating profile");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="profile-container">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="profile-form">
        <h2>Create Profile</h2>

        <div className="avatar-container">
          <label htmlFor="photo-upload" className="avatar-label">
            {formData.profileImage ? (
              <img src={formData.profileImage} alt="Profile" className="avatar" />
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
            name='profileImage'
            onChange={handlePhotoUpload}
            style={{ display: 'none' }}
          />
        </div>

        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />
        <input
          name="skills"
          placeholder="Skills (comma separated)"
          value={formData.skills}
          onChange={handleChange}
        />
        <input
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
        />

        <button onClick={saveProfile} disabled={loading}>
          {loading ? "Saving..." : "Create Profile"}
        </button>
      </div>
    </div>
  );
}