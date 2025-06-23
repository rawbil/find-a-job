import React, { useEffect, useState } from "react";
import "./ProfileDisplay.css";
import { getUserProfile } from "../../../utils/services/profile.service";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";
import { FaEnvelope } from "react-icons/fa";
//import { useParams } from "react-router-dom";
//import electrician from './electrician.png';

const ProfileDisplay = () => {
  //const { id } = useParams();
  const [userProfile, setuserProfile] = useState({})

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

  return (
    <div className="profile-container">
      <div className="profile-card-dark">
        <div className="profile-header">
          <div className="profile-photo-container">
            <img src={userProfile.profileImage} alt="Profile" className="profile-photo" />
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{userProfile.name}</h2>
            <p className="profile-title">
              {userProfile.skills[0] || "Professional"}
            </p>
            <p className="profile-location">
              <span className="icon">📍</span> {userProfile.location}
            </p>
            <p className="profile-availability">Available Today</p>
          </div>
        </div>
        <div className="profile-section">
          <div className="skills-section">
            <h3 className="section-title">Skills</h3>
            <div className="skills-list">
              {userProfile.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
          <div className="contact-section">
            <h3 className="section-title">Contact</h3>
            <div className="contact-buttons">
              {userProfile.phoneNumber && (
                <a
                  href={`https://wa.me/${formatPhoneNumber( userProfile.phoneNumber).replace("+", "")}`}
                  className="whatsapp-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              )}
              {userProfile.phoneNumbber && (
                <a href={`tel:${formatPhoneNumber(userProfile.phone)}`} className="phone-button">
                  Call
                </a>
              )}
              {userProfile.email && (
                <a
                  href={`https://facebook.com/${userProfile.facebook}`}
                  className="facebook-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaEnvelope />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;
