import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect,  } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { MenuItem, Select, FormControl, InputLabel, Box, Typography, Paper, Chip ,Stack,Button } from "@mui/material";

const DocumentDropdown  = ({ id }) => {
  const formTypes = [
    {
      id: "personal_history",
      name: "Personal History Form",
      apiEndpoint: `api/form/get/${id}`,
      fields: ["fullname", "address", "contactno", "NIC", "dateofbirth", "status"],
    },
    {
      id: "employment_form",
      name: "Employment Form",
      apiEndpoint: "/api/employment-form",
      fields: ["employeeId", "jobTitle", "department", "dateofJoin", "status"],
    },
    {
      id: "education_details",
      name: "Education Details Form",
      apiEndpoint: "/api/education-details",
      fields: ["schoolName", "degree", "yearOfGraduation", "GPA", "status"],
    },
  ];

  // State for selected form type
  const [selectedForm, setSelectedForm] = useState(formTypes[0].id);

  // State for form details
  const [formDetails, setFormDetails] = useState(null);

  // Fetch form details when the selected form type changes
  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        const selectedFormType = formTypes.find((form) => form.id === selectedForm);
        const res = await fetch(selectedFormType.apiEndpoint);
        const data = await res.json();
        if (res.ok) {
          setFormDetails(data);
        } else {
          console.error("Failed to fetch form details");
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    fetchFormDetails();
  }, [selectedForm]);

  const handleSelectChange = (event) => {
    setSelectedForm(event.target.value);
    setFormDetails(null); // Clear form details while fetching new data
  };

  return (
    <Box sx={{ width: "800px", margin: "0 auto", mt: 5 }}>
      <Typography variant="h4" component="h1">
        User Documents - Select Documents
      </Typography>

      {/* Dropdown for selecting form type */}
      <FormControl fullWidth sx={{ mt: 3 }}>
        <InputLabel id="form-select-label">Select Document</InputLabel>
        <Select
          labelId="form-select-label"
          value={selectedForm}
          onChange={handleSelectChange}
        >
          {formTypes.map((form) => (
            <MenuItem key={form.id} value={form.id}>
              {form.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Display form details */}
      {formDetails ? (
        <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6">Form Details</Typography>
          {formTypes
            .find((form) => form.id === selectedForm)
            .fields.map((field) => (
              <Typography key={field} variant="body1">
                <strong>{field.replace(/([A-Z])/g, " $1")}: </strong> {formDetails[field]}
              </Typography>
            ))}

          {/* Status with chip */}
          {formDetails.status && (
            <Typography variant="body1">
              <strong>Status:</strong>{" "}
              <Chip
                label={formDetails.status}
                color={formDetails.status === "Submitted" ? "success" : "warning"}
                size="small"
              />
            </Typography>
          )}

          {/* Buttons Section */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 2, justifyContent: "flex-end" }}
          >
            <Link to={`/updateform/${selectedForm}`}>
              <Button variant="contained" color="primary">
                Edit
              </Button>
            </Link>
            <Button variant="contained" color="error">
              Approve
            </Button>
          </Stack>
        </Paper>
      ) : (
        <Typography variant="body1" sx={{ mt: 3 }}>
          Loading form details...
        </Typography>
      )}
    </Box>
  );
};

export default DocumentDropdown;
