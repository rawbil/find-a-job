import React, { useEffect, useState } from "react";
import "./ClientProfile.css";
import { AxiosError } from "axios";
import {
  createClientPost,
  getClientPosts,
  updateClientPost,
  deleteClientPost,
  getSpecificUserPosts,
} from "../../../utils/services/client.service";
import toast from "react-hot-toast";
import { FaArrowLeft, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ClientProfile() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const navigate = useNavigate();
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await getSpecificUserPosts();
        if (response.success) {
          setPosts(response.userPosts);
          console.log(posts)
          setError("");
        } else {
          setError(response.message || "No posts found");
          setPosts([]);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(error.response?.data?.message || error.message || "An error occurred");
        } else if (typeof error === "object" && error !== null && "message" in error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    
  useEffect(() => {

    fetchPosts();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (post) => {
    setEditForm({
      ...post,
      services: Array.isArray(post.services) ? post.services.join(", ") : post.services,
      profileImage: post.profileImage?.url || post.profileImage || "",
    });
    setIsEditing(true);
  };

  const handleCreateClick = () => {
    setEditForm({
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
    setIsEditing(true);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditForm((prev) => ({ ...prev, profileImage: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

const handleSave = async () => {
  setLoading(true);
  setError("");
  try {
    // Build payload with only changed fields
    const payload = {};
    Object.keys(editForm).forEach((key) => {
      // Compare with original post if editing, otherwise include all fields for new post
      if (!editForm._id) {
        payload[key] = editForm[key];
      } else {
        const original = posts.find((p) => p._id === editForm._id) || {};
        if (
          key === "services"
            ? editForm.services.split(",").map(s => s.trim()).filter(Boolean).join(",") !== (Array.isArray(original.services) ? original.services.join(",") : "")
            : editForm[key] !== original[key]
        ) {
          payload[key] = editForm[key];
        }
      }
    });

    // Handle services array conversion
    if (payload.services) {
      payload.services = payload.services
        .split(",")
        .map((service) => service.trim())
        .filter(Boolean);
    }

    // Only send profileImage if it's a new file (base64, not URL), or if user removed it
    if (
      payload.profileImage &&
      (payload.profileImage.startsWith("http") || payload.profileImage.startsWith("/"))
    ) {
      delete payload.profileImage;
    }

    // If nothing changed, don't send request
    if (editForm._id && Object.keys(payload).length === 0) {
      toast("No changes to update.");
      setIsEditing(false);
      setLoading(false);
      return;
    }

    let response;
    if (editForm._id) {
      response = await updateClientPost(editForm._id, payload);
    } else {
      response = await createClientPost(payload);
    }

    if (response.success) {
      toast.success(response.message);
      const refreshed = await getSpecificUserPosts();
      setPosts(refreshed.posts || []);
      setIsEditing(false);
      setEditForm(null);
      await fetchPosts()
    } else {
      toast.error(response.message);
      setError(response.message);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      setError(error.message);
    } else {
      setError("An unexpected error occurred");
    }
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setLoading(true);
    try {
      const response = await deleteClientPost(postId);
      if (response.success) {
        toast.success("Post deleted");
        setPosts((prev) => prev.filter((p) => p._id !== postId));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-container">
    <div className="client-profile-container client-scrollable-profile" style={{ position: "relative" }}>
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
        }}
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft style={{ color: "#fff" }} size={20} />
      </div>

      <h2 style={{color: "whitesmoke"}}>Your Job Posts</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!isEditing && (
        <button
          onClick={handleCreateClick}
          className="client-edit-btn"
          style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <FaPlus /> Add New Post
        </button>
      )}

      {/* Cards for posts */}
      {!isEditing && Array.isArray(posts) && posts.length > 0 ? (
        <div className="client-posts-list" style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          {posts.map((post) => (
            <div
              key={post._id}
              className="client-profile-view"
              style={{
                marginBottom: "2rem",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "1rem",
                width: "320px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                
                position: "relative",
              }}
            >
              <div className="client-avatar-container" style={{ textAlign: "center" }}>
                <img
                  src={post.profileImage?.url || post.profileImage || "/user.png"}
                  alt="Profile"
                  className="client-profile-avatar"
                  style={{ margin: "0 auto" }}
                />
              </div>
              <h3>{post.name}</h3>
              <p><strong>Email:</strong> {post.email}</p>
              <p><strong>Location:</strong> {post.location}</p>
              <p><strong>Phone:</strong> {post.phoneNumber}</p>
              <div>
                <strong>Services:</strong>
                <ul className="client-skills-list">
                  {Array.isArray(post.services)
                    ? post.services.map((service, idx) => (
                        <li key={idx} className="client-skill-tag">{service}</li>
                      ))
                    : post.services}
                </ul>
              </div>
              <p><strong>Preferred Time:</strong> {post.preferredTime}</p>
              <p><strong>Description:</strong> {post.description}</p>
              <p><strong>Budget:</strong> {post.budget}</p>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button onClick={() => handleEditClick(post)} className="client-edit-btn" style={{ flex: 1 }}>
                  <FaEdit /> Edit
                </button>
                <button onClick={() => handleDelete(post._id)} className="client-cancel-btn" style={{ flex: 1 }}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ): (
        <div style={{
          display: "flex",
          width: "100%",
          height: "70vh",
          overflowY: "hidden",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <p style={
          {
            color: "#ccc"
          }
        }>Want to look for professionals to work for you? Add a post</p>
        </div>
      )}

      {/* Edit/Create Form */}
      {isEditing && (
        <form className="client-profile-form" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <h2>{editForm._id ? "Edit Post" : "Create Post"}</h2>
          <div className="client-avatar-container">
            <label htmlFor="photo-upload" className="client-avatar-label">
              {editForm.profileImage ? (
                <img src={editForm.profileImage} alt="Profile" className="client-avatar" />
              ) : (
                <div className="client-avatar-placeholder">
                  <span className="client-camera-icon">📷</span>
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
            {editForm.profileImage && (
              <button
                type="button"
                className="client-cancel-btn"
                style={{ marginTop: "0.5rem" }}
                onClick={() => setEditForm((prev) => ({ ...prev, profileImage: "" }))}
              >
                Remove Image
              </button>
            )}
          </div>
          <div className="client-form-row">
            <label>
              Name
              <input name="name" placeholder="Name" value={editForm.name} onChange={handleFormChange} />
            </label>
            <label>
              Email
              <input name="email" placeholder="Email" value={editForm.email} onChange={handleFormChange} />
            </label>
          </div>
          <div className="client-form-row">
            <label>
              Location
              <input name="location" placeholder="Location" value={editForm.location} onChange={handleFormChange} />
            </label>
            <label>
              Phone Number
              <input name="phoneNumber" placeholder="Phone Number" value={editForm.phoneNumber} onChange={handleFormChange} />
            </label>
            <label>
              Budget
              <input name="budget" placeholder="Budget" value={editForm.budget} onChange={handleFormChange} />
            </label>
          </div>
          <label>
            Services (comma separated)
            <input name="services" placeholder="Services (comma separated)" value={editForm.services} onChange={handleFormChange} />
          </label>
          <label>
            Preferred Time
            <input name="preferredTime" placeholder="Preferred Time" value={editForm.preferredTime} onChange={handleFormChange} />
          </label>
          <label>
            Description
            <textarea name="description" placeholder="Description" value={editForm.description} onChange={handleFormChange} rows={3} />
          </label>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : editForm._id ? "Save Changes" : "Create Post"}
            </button>
            <button type="button" onClick={() => { setIsEditing(false); setEditForm(null); }} className="client-cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && <div>Loading...</div>}
    </div></div>
  );
}