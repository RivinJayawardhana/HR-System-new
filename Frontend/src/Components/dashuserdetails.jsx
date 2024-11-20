import React, { useState } from "react";
import "./AdminDashboard.css"; // Import CSS for styling

// Dummy data for users and their forms
const dummyUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    forms: [
      { title: "Personal Details", status: "Completed" },
      { title: "Job Preferences", status: "Pending" },
      { title: "Document Uploads", status: "Completed" },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    forms: [
      { title: "Personal Details", status: "Completed" },
      { title: "Job Preferences", status: "Completed" },
      { title: "Document Uploads", status: "Pending" },
    ],
  },
];

const AdminDashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <div className="user-table">
        <table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dummyUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="view-details-btn"
                    onClick={() => handleUserClick(user)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="user-modal">
          <div className="modal-content">
            <h2>{selectedUser.name}</h2>
            <p>
              <strong>Email: </strong> {selectedUser.email}
            </p>
            <h3>Forms</h3>
            <ul>
              {selectedUser.forms.map((form, index) => (
                <li
                  key={index}
                  className={`form-item ${
                    form.status === "Completed" ? "completed" : "pending"
                  }`}
                >
                  {form.title} - {form.status}
                </li>
              ))}
            </ul>
            <button className="close-btn" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
