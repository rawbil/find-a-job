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
  FaUser,
  FaUserAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import ProfileDisplay from "../ProfileDisplay/ProfileDisplay";
import { useContext, useEffect, useState } from "react";
import { AxiosError } from "axios";
import {
  getAllProfilesService,
  getLatestProfilesService,
} from "../../../utils/services/profile.service";
//import { toast } from "react-hot-toast";
import AppContext from "../../../utils/context/ContextFunc";
import CustomerProfile from "../CustomerProfile/CustomerProfile";
import { getLatestClientPosts } from "../../../utils/services/client.service";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";
import {Link} from 'react-router-dom'
import AOS from 'aos';
import 'aos/dist/aos.css'

const workersImg = "/workers-illustration.png";

export default function Home() {
  const [latestProfiles, setLatestProfiles] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [viewAllProfiles, setViewAllProfiles] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const { accessToken, handleLogout } = useContext(AppContext);

  // ...existing state...
  const [latestJobs, setLatestJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState("");
  const [jobSearchQuery, setJobSearchQuery] = useState("");

    //aos animations
  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: 'ease-in-out',
      once: false,
    })
  }, [])

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

  useEffect(() => {
    const fetchLatestJobs = async () => {
      setJobsLoading(true);
      setJobsError("");
      try {
        const response = await getLatestClientPosts();
        if (response.success) {
          setLatestJobs(response.profiles); // or response.jobs if your backend returns jobs
        } else {
          setJobsError(response.message || "Failed to fetch jobs");
        }
      } catch (error) {
        setJobsError(
          error?.response?.data?.message ||
            error.message ||
            "An unexpected error occurred"
        );
      } finally {
        setJobsLoading(false);
      }
    };
    fetchLatestJobs();
  }, []);

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

  //filter jobs based on services required
  const filterJobs = (jobs) => {
    if (!jobSearchQuery.trim()) return jobs;
    return jobs.filter(
      (job) =>
        job.services &&
        job.services.some((service) =>
          service.toLowerCase().includes(jobSearchQuery.trim().toLowerCase())
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
          <a href="#jobs">Client Jobs</a>
          {accessToken && (
            <Link to="/profile" className="btn">
              <FaUserAlt /> Profile
            </Link>
          )}

          {accessToken ? (
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt size={20} /> Logout
            </button>
          ) : (
            <Link to="/auth" className="login-btn">
              Login
            </Link>
          )}
        </nav>
      </header>

      <section className="home-hero" data-aos='fade-up'>
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
        <h2 style={{color: "#fff"}}>Popular Services</h2>
        <div className="home-services-grid">
          {popularServices.map((service, index) => (
            <div className="home-service-card" key={index}>
              <div className="service-icon">{service.icon}</div>
              <span>{service.name}</span>
            </div>
          ))}
        </div>
      </section>

      <form className="home-search-bar" onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          placeholder="Search for services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-btn">
          <FaSearch size={17} />
        </button>
      </form>

      <section className="featured-providers">
        <div className="section-header">
          <h2 style={{color: "#fff"}}>
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
        <div className="providers-scroll-container" data-aos='fade-up'>
          <div className="providers-grid">
            {profileLoading
              ? "Fetching service providers... be patient dude!!"
              : fetchError.trim()
              ? "ooops... Error fetching providers. Check your internet connection"
              : filterProfiles(
                  viewAllProfiles ? allProfiles : latestProfiles
                ).map((profile, idx) => (
                  <div className="profile-card-dark" key={profile._id || idx}>
                    <div className="profile-header">
                      <div className="profile-photo-container">
                        <img
                          src={
                            profile.profileImage?.url
                              ? profile.profileImage.url
                              : "/user.png"
                          }
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
                        <p className="profile-availability">Available Today</p>
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
                              href={`https://wa.me/${formatPhoneNumber(profile.phoneNumber).replace("+", "")}`}
    className="whatsapp-button"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {/* 254 for whatsapp and +254 for tel */}
                              <FaWhatsapp className="whatsapp-icon" size={20} />
                            </a>
                          )}
                          {profile.phoneNumber && (
                            <a
                              href={`tel:${formatPhoneNumber(profile.phoneNumber)}`}
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
                ))}
          </div>
        </div>
      </section>

      {/*job search based on services */}
      <form
        className="home-search-bar"
        style={{ marginTop: "2rem" }}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="search"
          placeholder="Search for jobs by service..."
          value={jobSearchQuery}
          onChange={(e) => setJobSearchQuery(e.target.value)}
        />
        <button className="search-btn">
          <FaSearch size={17} />
        </button>
      </form>
      {/* Clients posting jobs */}
      <section className="featured-providers" id="jobs" data-aos='fade-up'>
        <div className="section-header">
          <h2 style={{color: "#fff"}}>Featured Jobs</h2>
          <p className="view-all">View All</p>
        </div>
        <div className="providers-scroll-container">
          <div className="providers-grid">
            {jobsLoading ? (
              "Fetching jobs... please wait."
            ) : jobsError ? (
              <span style={{ color: "red" }}>{jobsError}</span>
            ) : latestJobs.length === 0 ? (
              "No jobs available at the moment."
            ) : (
              filterJobs(latestJobs).map((job) => (
                <CustomerProfile key={job._id || job.id} job={job} />
              ))
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
