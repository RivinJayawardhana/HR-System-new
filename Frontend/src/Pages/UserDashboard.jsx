import React, { useState } from "react";
import "./UserDashboard.css"; // Import CSS for styling
import { useParams } from "react-router-dom";
import { Link , useNavigate } from "react-router-dom";

const dummyForms = [
  { id: 1, title: "Personal Details", description: "Fill in your personal information.", status: "Pending" },
  { id: 2, title: "Job Preferences", description: "Let us know your job preferences.", status: "Pending" },
  { id: 3, title: "Document Uploads", description: "Upload necessary documents.", status: "Completed" },
  { id: 4, title: "Feedback", description: "Provide your feedback about the process.", status: "Pending" },
];

const UserDashboard = () => {
  const [selectedForm, setSelectedForm] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleTileClick = (form) => {
    setSelectedForm(form);
    navigate(`/histryform/${id}`)

  };

  const handleCloseModal = () => {
    setSelectedForm(null);
  };
  console.log(id)
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">User Dashboard</h1>
      <div className="tiles-container">
        {dummyForms.map((form) => (
          <div
            key={form.id}
            className={`form-tile ${
              form.status === "Completed" ? "completed" : "pending"
            }`}
            onClick={() => handleTileClick(form)}
          >
            <h2 className="form-title">{form.title}</h2>
            <p className="form-description">{form.description}</p>
            <p className="form-status">
              {form.status === "Completed" ? "✅ Completed" : "🕒 Pending"}
            </p>
          </div>
        ))}
      </div>

      {selectedForm && (
        <div className="form-modal">
          <div className="modal-content">
            <h2>{selectedForm.title}</h2>
            <p>{selectedForm.description}</p>
            <p>
              <strong>Status: </strong> {selectedForm.status}
            </p>
            <button className="form-cancel-btn" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;


