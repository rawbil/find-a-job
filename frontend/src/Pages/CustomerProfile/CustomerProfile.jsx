import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";
import "./CustomerProfile.css";

const CustomerProfile = ({ job }) => {
  //   const job = {
  //     client: "Alex Kibaya",
  //     category: "Plumbing",
  //     description: "Fix leaking kitchen pipe under the sink.",
  //     location: "Kisauni, Mombasa",
  //     budget: "Ksh 2,000",
  //     timeline: "Next Week",
  //     whatsapp: "+254701206117",
  //     phone: "+254701206117",
  //     photo: "https://alexmwangikibaya.netlify.app/alex%202.jpg",
  //   };

  return (
    <div className="customer-container">
      <div className="job-card-dark">
        <div className="job-photo-container">
          <img src={job.photo} alt="Client" className="job-photo" />
        </div>
        <div className="job-header">
          <h2 className="job-name">{job.client}</h2>
          <p className="job-category">Services Required: {job.category}</p>
          <p className="job-location">
            <span className="icon">📍</span> {job.location}
          </p>
          <p className="job-timeline">📅Preferred Time: {job.timeline}</p>
        </div>

        <div className="job-section">
          <h3 className="section-title">Description</h3>
          <p className="job-description">{job.description}</p>

          <h3 className="section-title">Budget</h3>
          <p className="job-budget">💰 {job.budget}</p>

          <h3 className="section-title">Contact</h3>
          <div className="contact-buttons">
            {job.phoneNumber && (
              <a
                href={`https://wa.me/${formatPhoneNumber(
                  job.phoneNumber
                ).replace("+", "")}`}
                className="whatsapp-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            )}
            {job.phoneNumber && (
              <a href={`tel:${formatPhoneNumber(job.phone)}`} className="call-button">
                Call
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
