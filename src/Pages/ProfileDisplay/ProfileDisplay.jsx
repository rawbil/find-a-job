import React from "react";
import "./ProfileDisplay.css";
//import { useParams } from "react-router-dom";
//import electrician from './electrician.png';

const ProfileDisplay = () => {
  //const { id } = useParams();

  const profile = {
    name: "James Mwangi",
    skills: "Electrician, Residential and commercial wiring",
    location: "Kisauni, Mombasa",
    phone: "+254712345678",
    whatsapp: "+254712345678",
    facebook: "james.mwangi.electrician",
    photo: "https://alexmwangikibaya.netlify.app/alex%202.jpg",
  };

  return (
    <div className="profile-container">
      <div className="profile-card-dark">
        <div className="profile-header">
          <div className="profile-photo-container">
            <img src={profile.photo} alt="Profile" className="profile-photo" />
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{profile.name}</h2>
            <p className="profile-title">
              {profile.skills.split(",")[0] || "Professional"}
            </p>
            <p className="profile-location">
              <span className="icon">📍</span> {profile.location}
            </p>
            <p className="profile-availability">Available Today</p>
          </div>
        </div>
        <div className="profile-section">
          <div className="skills-section">
            <h3 className="section-title">Skills</h3>
            <div className="skills-list">
              {profile.skills.split(",").map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
          <div className="contact-section">
            <h3 className="section-title">Contact</h3>
            <div className="contact-buttons">
              {profile.whatsapp && (
                <a
                  href={`https://wa.me/${profile.whatsapp}`}
                  className="whatsapp-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              )}
              {profile.phone && (
                <a href={`tel:${profile.phone}`} className="phone-button">
                  Call
                </a>
              )}
              {profile.facebook && (
                <a
                  href={`https://facebook.com/${profile.facebook}`}
                  className="facebook-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
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
