import React, { useEffect, useState } from "react";
import "./ProviderProfile.css";
import { AxiosError } from "axios";
import {
  createUserProfileService,
  getUserProfile,
  updateUserProfileService,
} from "../../../utils/services/profile.service";
import toast from "react-hot-toast";
//import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ProviderProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    skills: "",
    phoneNumber: "",
    profileImage: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userProfile, setuserProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  //const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await getUserProfile();
        if (response.success) {
          setuserProfile(response.profile);
          console.log(response.profile);
        } else {
          console.log(response.message);
          toast.error(response.message);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error);
          toast.error(error);
        } else {
          console.log(error.message);
        }
      }
    };

    getProfile();
  }, []);

  const handleEditClick = () => {
    setEditForm({
      name: userProfile.name || "",
      email: userProfile.email || "",
      location: userProfile.location || "",
      skills: userProfile.skills ? userProfile.skills.join(", ") : "",
      phoneNumber: userProfile.phoneNumber || "",
      profileImage:
        userProfile.profileImage?.url || userProfile.profileImage || "",
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
      // Compare with original userProfile
      if (
        key === "skills"
          ? editForm.skills.split(",").map(s => s.trim()).filter(Boolean).join(",") !== (userProfile.skills || []).join(",")
          : editForm[key] !== userProfile[key]
      ) {
        payload[key] = editForm[key];
      }
    });

    // Handle skills array conversion
    if (payload.skills) {
      payload.skills = payload.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    // Only send profileImage if it's a new file (base64, not URL)
    if (
      payload.profileImage && (payload.profileImage.startsWith("http") || payload.profileImage.startsWith("/"))
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

      const response = await updateUserProfileService(payload);
      if (response.success) {
        toast.success(response.message);
        setuserProfile(response.profile);
        setIsEditing(false);
        window.location.reload();
      } else {
        toast.error(response.message);
        setError(response.message);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.message);
        console.log(error.message);
      } else {
        console.log("An unexpected error occurred when updating profile");
        setError(error.message)
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
      // Convert skills string to array
      const payload = {
        ...formData,
        skills:
          typeof formData.skills === "string"
            ? formData.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
            : formData.skills,
      };
      const response = await createUserProfileService(payload);
      if (response.success) {
        toast.success(response.message);
        //navigate("/");
        setuserProfile(response.profile);
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
  const navigate = useNavigate();

  return (
    <div className="profile-container">
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
        }}
      >
        <FaArrowLeft
          onClick={() => navigate(-1)}
          style={{
            color: "#fff",
          }}
          size={20}
        />
      </div>
      {userProfile && userProfile.name && !isEditing ? (
        <div className="profile-view">
          <button onClick={handleEditClick} className="edit-btn">
            Edit Profile
          </button>

          <div className="avatar-container">
            <img
              src={
                userProfile.profileImage?.url ||
                userProfile.profileImage ||
                "/default-avatar.png"
              }
              alt="Profile"
              className="profile-avatar"
            />
          </div>
          <h2>{userProfile.name}</h2>
          <p className="profile-content">
            <strong>Email:</strong> {userProfile.email}
          </p>
          <p className="profile-content">
            <strong>Location:</strong> {userProfile.location}
          </p>
          <p className="profile-content">
            <strong>Phone:</strong> {userProfile.phoneNumber}
          </p>
          <div className="profile-content">
            <strong>Skills:</strong>
            <ul className="skills-list">
              {userProfile.skills &&
                userProfile.skills.map((skill, idx) => (
                  <li key={idx} className="skill-tag">
                    {skill}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      ) : isEditing ? (
        <div className="profile-form">
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
          <input
            name="name"
            placeholder="Name"
            value={editForm.name}
            onChange={handleEditChange}
          />
          <input
            name="email"
            placeholder="Email"
            value={editForm.email}
            onChange={handleEditChange}
          />
          <input
            name="location"
            placeholder="Location"
            value={editForm.location}
            onChange={handleEditChange}
          />
          <input
            name="skills"
            placeholder="Skills (comma separated)"
            value={editForm.skills}
            onChange={handleEditChange}
          />
          <input
            name="phoneNumber"
            placeholder="Phone Number"
            value={editForm.phoneNumber}
            onChange={handleEditChange}
          />
          <button onClick={updateProfile} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button onClick={() => setIsEditing(false)} className="cancel-btn">
            Cancel
          </button>
        </div>
      ) : (
        <>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="profile-form">
            <h2>Create Profile</h2>
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
        </>
      )}
    </div>
  );
}
