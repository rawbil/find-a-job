import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  deleteUserService,
  getUserService,
  updateUserService,
} from "../../../utils/services/user.service";
import AppContext from "../../../utils/context/ContextFunc";
import { FaPenSquare } from "react-icons/fa";

export default function UserProfile() {
  const navigate = useNavigate();
  const { userById, setUserById } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", email: "" });
  const [password, setPassword] = useState("");
   const getUserById = async () => {
      try {
        const response = await getUserService();
        if (response.success) {
          setUserById(response.user);
          localStorage.setItem("userById", JSON.stringify(response.user));
          console.log(response.user);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
        throw new Error(error.response.data.message);
      }
    };
  useEffect(() => {
 
    getUserById();
  }, []);

  // Handle edit button
  const handleEditClick = () => {
    setEditForm({
      fullName: userById?.fullName || "",
      email: userById?.email || "",
    });
    setIsEditing(true);
  };

  // Handle delete button
  const handleDeleteClick = async () => {
    const input = window.prompt(
      "Please enter your password to confirm account deletion:"
    );
    if (!input) return;
    setPassword(input);

    // if (
    //   !window.confirm(
    //     "Are you sure you want to delete your account? This cannot be undone."
    //   )
    // )
    // return;
    try {
      const response = await deleteUserService(input);
      if (response.success) {
        toast.success("Account deleted.");
        // log out and redirect

        localStorage.clear();
        navigate("/auth");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  };

  // Handle save after editing
  const handleSave = async () => {
    try {
      // Only include fields that have changed and are not empty
      const updatedForm = {};
      if (
        editForm.fullName.trim() &&
        editForm.fullName.trim() !== userById.fullName
      ) {
        updatedForm.fullName = editForm.fullName.trim();
      }
      if (
        editForm.email.trim() &&
        editForm.email.trim() !== userById.email
      ) {
        updatedForm.email = editForm.email.trim();
      }

      // If no changes made, do not submit
      if (Object.keys(updatedForm).length === 0) {
        toast.error("No change made");
        setIsEditing(false);
        return;
      }

      const response = await updateUserService(updatedForm);
      if (response.success) {
        toast.success("Profile updated.");
        setUserById(response.user);
        setIsEditing(false);
        await getUserById();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  };

  return (
    <div className="profile-choice-container">
      <h2>
        Welcome Back <span className="username">{userById?.fullName || ""}</span>{" "}
        <span>
          {" "}
          <FaPenSquare
            style={{ cursor: "pointer" }}
            title="edit user"
            // onClick={() => setIsEditing(!isEditing)}
            onClick={handleEditClick}
          />
        </span>
      </h2>
      <div className="profile-choice-buttons">
        <button
          className="profile-choice-btn"
          onClick={() => navigate("/profile/provider")}
        >
          My Provider Profile
        </button>
        <button
          className="profile-choice-btn"
          onClick={() => navigate("/profile/client")}
        >
          My Client Posts
        </button>
      </div>
      <div className="profile-body">
        {isEditing ? (
          <section className="profile-form">
            <label htmlFor="name" style={{ textAlign: "start", color: "#ccc" }}>
              Name:
            </label>
            <input
              type="text"
              name="fullName"
              value={editForm.fullName}
              onChange={(e) =>
                setEditForm({ ...editForm, fullName: e.target.value })
              }
            />

            <label style={{ textAlign: "start", color: "#ccc" }}>Email:</label>
            <input
              type="email"
              value={editForm.email}
              name="email"
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
            />

            <div className="profile-sub">
              <button onClick={handleSave} className="profile-choice-btn">
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="profile-choice-btn"
                style={{ background: "#eee", color: "#333" }}
              >
                Cancel
              </button>
            </div>
          </section>
        ) : (
          <div className="edit-off">
            <div className="profile-details">
              <p>Name: {userById?.fullName}</p>
              <p>Email: {userById?.email}</p>
              {/* <button onClick={handleEditClick} className="profile-choice-btn">Edit Profile</button>*/}
            </div>
            <div className="delete-container">
              {/* <input
                type="password"
                placeholder="Enter password to delete"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginTop: "1rem", display: "block" }}
              /> */}
              <button
                onClick={handleDeleteClick}
                className="profile-choice-btn"
                style={{ background: "#e53e3e" }}
                // disabled={!password}
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
