import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Paper,
  Chip,
  Grid,
  Stack,
  Button,
  CircularProgress,
} from "@mui/material";

const DocumentDropdown = ({ id }) => {
  const formTypes = [
    {
      id: "personal_history",
      name: "Personal History Form",
      apiEndpoint: `api/form/get/${id}`,
      fields: [
        "fullname",
        "address",
        "contactno",
        "NIC",
        "dateofbirth",
        "status",
        "document1",
        "academicQualifications",
        "previousEmploymentDetails",
        "spouseDetails",
        "emergencyContact",
      ],
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

  const [selectedForm, setSelectedForm] = useState(formTypes[0].id);
  const [formDetails, setFormDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFormDetails = async () => {
      setLoading(true);
      try {
        const selectedFormType = formTypes.find(
          (form) => form.id === selectedForm
        );
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
      setLoading(false);
    };

    fetchFormDetails();
  }, [selectedForm]);

  const handleSelectChange = (event) => {
    setSelectedForm(event.target.value);
    setFormDetails(null);
  };

  return (
    <Box sx={{ width: "800px", margin: "0 auto", mt: 5 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        User Documents - Select Documents
      </Typography>

      <FormControl fullWidth>
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

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : formDetails ? (
        <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Form Details
          </Typography>
          <Grid container spacing={2}>
            {formTypes
              .find((form) => form.id === selectedForm)
              .fields.map((field) => (
                <Grid item xs={12} sm={6} key={field}>
                  <Typography variant="body1">
                    <strong>{field.replace(/([A-Z])/g, " $1")}: </strong>
                    {Array.isArray(formDetails[field]) ? (
                      <ul>
                        {formDetails[field].map((item, index) =>
                          typeof item === "object" ? (
                            <li key={index}>
                              {Object.entries(item).map(([key, value]) => (
                                <Typography key={key} variant="body2">
                                  <strong>
                                    {key.replace(/([A-Z])/g, " $1")}:{" "}
                                  </strong>
                                  {value}
                                </Typography>
                              ))}
                            </li>
                          ) : (
                            <li key={index}>
                              <Typography variant="body2">{item}</Typography>
                            </li>
                          )
                        )}
                      </ul>
                    ) : typeof formDetails[field] === "object" ? (
                      <ul>
                        {Object.entries(formDetails[field]).map(
                          ([key, value]) => (
                            <li key={key}>
                              <Typography variant="body2">
                                <strong>
                                  {key.replace(/([A-Z])/g, " $1")}:{" "}
                                </strong>
                                {value}
                              </Typography>
                            </li>
                          )
                        )}
                      </ul>
                    ) : field === "document1" ? (
                      <a
                        href={formDetails[field]}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none", color: "#1976d2" }}
                      >
                        View Document
                      </a>
                    ) : (
                      formDetails[field] || "N/A"
                    )}
                  </Typography>
                </Grid>
              ))}
          </Grid>
          {formDetails.status && (
            <Typography variant="body1" sx={{ mt: 2 }}>
              <strong>Status:</strong>{" "}
              <Chip
                label={formDetails.status}
                color={
                  formDetails.status === "Submitted" ? "success" : "warning"
                }
                size="small"
              />
            </Typography>
          )}
          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 2, justifyContent: "flex-end" }}
          >
            <Link to={`/`}>
              <Button variant="contained" color="primary">
                Edit
              </Button>
            </Link>
            <Button variant="contained" color="success">
              Approve
            </Button>
            <Button variant="contained" color="error">
              Print
            </Button>
          </Stack>
        </Paper>
      ) : (
        <Typography variant="body1" sx={{ mt: 3 }}>
          No form details available.
        </Typography>
      )}
    </Box>
  );
};

export default DocumentDropdown;
