import React, { useState } from "react";
import "./AdminDashboard.css";

// Dummy data for user forms
const dummyForms = [
  {
    id: 1,
    title: "Personal Details",
    status: "Completed",
    data: {
      Name: "John Doe",
      Age: "28",
      Email: "johndoe@example.com",
    },
  },
  {
    id: 2,
    title: "Job Preferences",
    status: "Pending",
    data: {
      "Preferred Role": "Software Engineer",
      "Expected Salary": "Not Submitted",
    },
  },
  {
    id: 3,
    title: "Document Uploads",
    status: "Completed",
    data: {
      "Resume": "Uploaded",
      "Cover Letter": "Uploaded",
      "ID Proof": "Uploaded",
    },
  },
];

const AdminDashboard = () => {
  const [expandedFormId, setExpandedFormId] = useState(null);

  const handleTileClick = (formId) => {
    if (expandedFormId === formId) {
      setExpandedFormId(null); // Collapse if clicked again
    } else {
      setExpandedFormId(formId); // Expand clicked form
    }
  };

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <div className="form-tiles">
        {dummyForms.map((form) => (
          <div
            key={form.id}
            className={`form-tile ${
              form.status === "Completed" ? "completed" : "pending"
            }`}
          >
            <div onClick={() => handleTileClick(form.id)}>
              <h3>{form.title}</h3>
              <p>Status: {form.status}</p>
            </div>
            {expandedFormId === form.id && (
              <div className="form-details">
                <h4>Form Data</h4>
                <form>
                  {Object.entries(form.data).map(([key, value], index) => (
                    <div key={index} className="form-field">
                      <label>{key}</label>
                      <input
                        type="text"
                        value={value}
                        readOnly
                        className="readonly-input"
                      />
                    </div>
                  ))}
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
