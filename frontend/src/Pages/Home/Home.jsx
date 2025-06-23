import "./Home.css";
import {
  FaTools,
  FaPaintRoller,
  FaTshirt,
  FaBolt,
  FaCar,
  FaWrench,
  FaWhatsapp,
  FaPhone,
  FaPhoneAlt,
  FaEnvelope,
  FaSearch,
} from "react-icons/fa";
import ProfileDisplay from "../ProfileDisplay/ProfileDisplay";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import {
  getAllProfilesService,
  getLatestProfilesService,
} from "../../../utils/services/profile.service";
//import { toast } from "react-hot-toast";

const workersImg = "/workers-illustration.png";

export default function Home() {
  const [latestProfiles, setLatestProfiles] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [viewAllProfiles, setViewAllProfiles] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getLatestProfiles = async () => {
      setProfileLoading(true);
      try {
        const response = viewAllProfiles
          ? await getAllProfilesService()
          : await getLatestProfilesService();
        console.log(response);
        if (response.success) {
          viewAllProfiles
            ? setAllProfiles(response.profiles)
            : setLatestProfiles(response.profiles);
          console.log(response.message);
        } else {
          setFetchError(response.message);
          console.log(response.message);
          setProfileLoading(false);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error.message);
        } else {
          console.log(error.message);
        }
        setProfileLoading(false);
        setFetchError(error.message);
      } finally {
        setProfileLoading(false);
        setFetchError("");
      }
    };
    //call the function
    getLatestProfiles();
  }, [viewAllProfiles]);
  // const featuredProviders = [
  //   {
  //     id: 1,
  //     name: "James Mwangi",
  //     skills: "Electrician, Residential wiring, Commercial wiring",
  //     location: "Kisauni, Mombasa",
  //     phone: "+254712345678",
  //     whatsapp: "+254712345678",
  //     facebook: "james.mwangi.electrician",
  //     photo: "https://alexmwangikibaya.netlify.app/alex%202.jpg",
  //   },
  //   {
  //     id: 2,
  //     name: "Susan Achieng",
  //     skills: "Plumbing, Pipe installation, Drainage",
  //     location: "Kisumu",
  //     phone: "+254712345679",
  //     whatsapp: "+254712345679",
  //     facebook: "susan.achieng.plumbing",
  //     photo: "https://randomuser.me/api/portraits/women/44.jpg",
  //   },
  //   {
  //     id: 3,
  //     name: "John Kamau",
  //     skills: "Painting, Wall repair, Decorating",
  //     location: "Nairobi",
  //     phone: "+254712345670",
  //     whatsapp: "+254712345670",
  //     facebook: "john.kamau.painter",
  //     photo: "https://randomuser.me/api/portraits/men/32.jpg",
  //   },
  // ];

  const popularServices = [
    { name: "Plumbing", icon: <FaTools /> },
    { name: "Painting", icon: <FaPaintRoller /> },
    { name: "Tailoring", icon: <FaTshirt /> },
    { name: "Electricians", icon: <FaBolt /> },
    { name: "Mechanics", icon: <FaCar /> },
  ];

  const filterProfiles = (profiles) => {
    if (!searchQuery.trim()) return profiles;
    return profiles.filter((profile) =>
      profile.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    );
  };

  return (
    <div className="home dark">
      <header className="home-navbar">
        <div className="home-logo">
          <FaWrench className="logo-icon" /> JobJua
        </div>
        <nav className="home-nav">
          <a href="#services">Popular Services</a>
          <a href="/profile" className="btn">
            Create Provider Profile
          </a>
        </nav>
      </header>

      <section className="home-hero">
        <div className="home-hero-text">
          <h1>Find Trusted Local Services Near You</h1>
          <p>
            Connect with skilled professionals for all your home and business
            needs. Whether you need a plumber, electrician, painter, or
            mechanic, JobJua makes it easy to discover and hire reliable service
            providers in your area.
          </p>
          
        </div>
        <div className="home-hero-illustration">
          <img
            src={workersImg}
            alt="Workers illustration"
            className="workers-img"
          />
        </div>
      </section>

      <section className="home-services" id="services">
        <h2>Popular Services</h2>
        <div className="home-services-grid">
          {popularServices.map((service, index) => (
            <div className="home-service-card" key={index}>
              <div className="service-icon">{service.icon}</div>
              <span>{service.name}</span>
            </div>
          ))}
        </div>
      </section>

      <form className="home-search-bar" onSubmit={(e) => e.preventDefault() }>
            <input
              type="search"
              placeholder="Search for services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button>
              <FaSearch size={20} />
            </button>
          </form>

      <section className="featured-providers">
        <div className="section-header">
          <h2>
            {viewAllProfiles
              ? "Browse Service Providers"
              : "Featured Service Providers"}
          </h2>
          <p
            className="view-all"
            onClick={() => setViewAllProfiles(!viewAllProfiles)}
          >
            View All
          </p>
        </div>
        <div className="providers-scroll-container">
          <div className="providers-grid">
            {profileLoading ? (
              "Fetching service providers... be patient dude!!"
            ) : fetchError.trim() ? (
              "ooops... Error fetching providers. Check your internet connection"
            ) : (
              filterProfiles(viewAllProfiles ? allProfiles : latestProfiles).map(
                (profile, idx) => (
                  <div className="profile-card-dark" key={profile._id || idx}>
                    <div className="profile-header">
                      <div className="profile-photo-container">
                        <img
                          src={profile.profileImage?.url}
                          alt="Profile"
                          className="profile-photo"
                        />
                      </div>
                      <div className="profile-info">
                        <h2 className="profile-name">{profile.name}</h2>
                        <p className="profile-title">
                          {(profile.skills[0] &&
                            profile.skills[0].toUpperCase()) ||
                            "Professional"}
                        </p>
                        <p className="profile-location">
                          <span className="icon">📍</span> {profile.location}
                        </p>
                        <p className="profile-availability">
                          Available Today
                        </p>
                      </div>
                    </div>
                    <div className="profile-section">
                      <div className="skills-section">
                        <h3 className="section-title">Skills</h3>
                        <div className="skills-list">
                          {profile.skills.map((skill, index) => (
                            <span key={index} className="skill-tag">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="contact-section">
                        <h3 className="section-title">Contact</h3>
                        <div className="contact-buttons">
                          {profile.phoneNumber && (
                            <a
                              href={`https://wa.me/${profile.phoneNumber}`}
                              className="whatsapp-button"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaWhatsapp
                                className="whatsapp-icon"
                                size={20}
                              />
                            </a>
                          )}
                          {profile.phoneNumber && (
                            <a
                              href={`tel:${profile.phoneNumber}`}
                              className="phone-button"
                            >
                              <FaPhoneAlt size={20} />
                            </a>
                          )}
                          {profile.email && (
                            <a
                              href={`mailto:${profile.email}`}
                              className="facebook-button"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaEnvelope size={20} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>JobJua</h3>
            <p>Connecting you with trusted local service providers</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#services">Services</a>
              </li>
              <li>
                <a href="#">Become a Provider</a>
              </li>
              <li>
                <a href="#">About Us</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: info@jobjua.com</p>
            <p>Phone: +254 700 000000</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} JobJua. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
