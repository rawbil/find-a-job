import React, { useEffect, useState } from "react";
import "./ClientProfile.css";
import { AxiosError } from "axios";
import {
  createClientPost,
  getClientPost,
  updateClientPost,
} from "../../../utils/services/client.service";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ClientProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    services: "",
    preferredTime: "",
    description: "",
    budget: "",
    phoneNumber: "",
    profileImage: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientProfile, setClientProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getClientPost();
        if (response.success) {
          setClientProfile(response.profile);
          setError(""); // clear any previous error
        } else {
          setError(response.message || "Profile not found");
          setClientProfile({});
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(error.response?.data?.message || error.message || "An error occurred");
        } else if (typeof error === "object" && error !== null && "message" in error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
        setClientProfile({});
      }
    };
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setEditForm({
      name: clientProfile.name || "",
      email: clientProfile.email || "",
      location: clientProfile.location || "",
      services: clientProfile.services ? clientProfile.services.join(", ") : "",
      preferredTime: clientProfile.preferredTime || "",
      description: clientProfile.description || "",
      budget: clientProfile.budget || "",
      phoneNumber: clientProfile.phoneNumber || "",
      profileImage:
        clientProfile.profileImage?.url || clientProfile.profileImage || "",
    });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateProfile = async () => {
    setLoading(true);
    setError("");
    try {
      // Build payload with only changed fields
      const payload = {};
      Object.keys(editForm).forEach((key) => {
        // Compare with original clientProfile
        if (
          key === "services"
            ? editForm.services
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .join(",") !== (clientProfile.services || []).join(",")
            : editForm[key] !== clientProfile[key]
        ) {
          payload[key] = editForm[key];
        }
      });

      // Handle services array conversion
      if (payload.services) {
        payload.services = payload.services
          .split(",")
          .map((service) => service.trim())
          .filter(Boolean);
      }

      // Only send profileImage if it's a new file (base64, not URL)
      if (
        payload.profileImage &&
        (payload.profileImage.startsWith("http") ||
          payload.profileImage.startsWith("/"))
      ) {
        delete payload.profileImage;
      }

      // If nothing changed, don't send request
      if (Object.keys(payload).length === 0) {
        toast("No changes to update.");
        setIsEditing(false);
        setLoading(false);
        return;
      }

      const response = await updateClientPost(payload);
      if (response.success) {
        toast.success(response.message);
        setClientProfile(response.updatedProfile);
        setIsEditing(false);
       // window.location.reload();
      } else {
        toast.error(response.message);
        setError(response.message);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred when updating profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, profileImage: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...formData,
        services:
          typeof formData.services === "string"
            ? formData.services
                .split(",")
                .map((service) => service.trim())
                .filter(Boolean)
            : formData.services,
      };
      const response = await createClientPost(payload);
      if (response.success) {
        toast.success(response.message);
        setClientProfile(response.profile);
        setIsEditing(false);
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
    <div
      className="profile-container scrollable-profile"
      style={{ position: "relative" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "4px",
          borderRadius: "10px",
          placeSelf: "start",
          marginLeft: "20%",
          cursor: "pointer",
          background: "royalblue",
          width: "50px",
          position: "absolute",
          top: "100px",
        }} onClick={() => navigate(-1)}
      >
        <FaArrowLeft
         
          style={{
            color: "#fff",
          }}
          size={20}
        />
      </div>
      {error && !clientProfile.name ? (
        <div className="profile-form">
          <h2>{error}</h2>
          {/* Show the create profile form */}
          <form>
            <div className="avatar-container">
              <label htmlFor="photo-upload" className="avatar-label">
                {formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt="Profile"
                    className="avatar"
                  />
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
                name="profileImage"
                onChange={handlePhotoUpload}
                style={{ display: "none" }}
              />
            </div>
            <div className="form-row">
              <label>
                Name
                <input
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </label>
              <label>
                Email
                <input
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Location
                <input
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </label>
              <label>
                Phone Number
                <input
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </label>
              <label>
                Budget
                <input
                  name="budget"
                  placeholder="Budget"
                  value={formData.budget}
                  onChange={handleChange}
                />
              </label>
            </div>
            <label>
              Services (comma separated)
              <input
                name="services"
                placeholder="Services (comma separated)"
                value={formData.services}
                onChange={handleChange}
              />
            </label>
            <label>
              Preferred Time
              <input
                name="preferredTime"
                placeholder="Preferred Time"
                value={formData.preferredTime}
                onChange={handleChange}
              />
            </label>
            <label>
              Description
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </label>
            <button type="button" onClick={saveProfile} disabled={loading}>
              {loading ? "Saving..." : "Create Profile"}
            </button>
          </form>
        </div>
      ) : clientProfile && clientProfile.name && !isEditing ? (
        <div className="profile-view">
          <button onClick={handleEditClick} className="edit-btn">
            Edit Profile
          </button>
          <div className="avatar-container">
            <img
              src={
                clientProfile.profileImage?.url ||
                clientProfile.profileImage ||
                "/user.png"
              }
              alt="Profile"
              className="profile-avatar"
            />
          </div>
          <h2>{clientProfile.name}</h2>
          <p className="profile-content">
            <strong>Email:</strong> {clientProfile.email}
          </p>
          <p className="profile-content">
            <strong>Location:</strong> {clientProfile.location}
          </p>
          <p className="profile-content">
            <strong>Phone:</strong> {clientProfile.phoneNumber}
          </p>
          <div className="profile-content">
            <strong>Services:</strong>
            <ul className="skills-list">
              {clientProfile.services &&
                clientProfile.services.map((service, idx) => (
                  <li key={idx} className="skill-tag">
                    {service}
                  </li>
                ))}
            </ul>
          </div>
          <p className="profile-content">
            <strong>Preferred Time:</strong> {clientProfile.preferredTime}
          </p>
          <p className="profile-content">
            <strong>Description:</strong> {clientProfile.description}
          </p>
          <p className="profile-content">
            <strong>Budget:</strong> {clientProfile.budget}
          </p>
        </div>
      ) : isEditing ? (
        <form className="profile-form">
          {error && <p style={{ color: "red" }}>{error}</p>}
          <h2>Edit Profile</h2>
          <div className="avatar-container">
            <label htmlFor="edit-photo-upload" className="avatar-label">
              {editForm.profileImage ? (
                <img
                  src={editForm.profileImage}
                  alt="Profile"
                  className="avatar"
                />
              ) : (
                <div className="avatar-placeholder">
                  <span className="camera-icon">📷</span>
                </div>
              )}
            </label>
            <input
              id="edit-photo-upload"
              type="file"
              accept="image/*"
              name="profileImage"
              onChange={(e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onloadend = () => {
                  setEditForm((prev) => ({
                    ...prev,
                    profileImage: reader.result,
                  }));
                };
                if (file) reader.readAsDataURL(file);
              }}
              style={{ display: "none" }}
            />
          </div>

          <div className="form-row">
            <label>
              Name
              <input
                name="name"
                placeholder="Name"
                value={editForm.name}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Email
              <input
                name="email"
                placeholder="Email"
                value={editForm.email}
                onChange={handleEditChange}
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Location
              <input
                name="location"
                placeholder="Location"
                value={editForm.location}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Phone Number
              <input
                name="phoneNumber"
                placeholder="Phone Number"
                value={editForm.phoneNumber}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Budget
              <input
                name="budget"
                placeholder="Budget"
                value={editForm.budget}
                onChange={handleEditChange}
              />
            </label>
          </div>
          <label>
            Services (comma separated)
            <input
              name="services"
              placeholder="Services (comma separated)"
              value={editForm.services}
              onChange={handleEditChange}
            />
          </label>
          <label>
            Preferred Time
            <input
              name="preferredTime"
              placeholder="Preferred Time"
              value={editForm.preferredTime}
              onChange={handleEditChange}
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              placeholder="Description"
              value={editForm.description}
              onChange={handleEditChange}
              rows={3}
            />
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <button type="button" onClick={updateProfile} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      ) :(
        <div>Loading...</div>
      )}
    </div>
  );
}