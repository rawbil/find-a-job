import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function UserProfile() {
  const navigate = useNavigate();

  return (
    <div className="profile-choice-container">
      <h2>Choose Profile Type</h2>
      <div className="profile-choice-buttons">
        <button
          className="profile-choice-btn"
          onClick={() => navigate("/profile/provider")}
        >
          Provider Profile
        </button>
        <button
          className="profile-choice-btn"
          onClick={() => navigate("/profile/client")}
        >
          Client Profile
        </button>
      </div>
    </div>
  );
}