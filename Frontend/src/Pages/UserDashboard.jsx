import React, { useState } from "react";
import axios from "axios";

const FormsPage = () => {
  const [formTitle, setFormTitle] = useState("");
  const [formData, setFormData] = useState("");

  const handleSubmit = () => {
    axios.post("/user/submit-form", { title: formTitle, data: formData })
      .then(() => alert("Form submitted successfully"))
      .catch((error) => console.error("Form submission error:", error));
  };

  return (
    <div>
      <h1>Forms</h1>
      <input
        type="text"
        placeholder="Form Title"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
      />
      <textarea
        placeholder="Form Data"
        value={formData}
        onChange={(e) => setFormData(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default FormsPage;
