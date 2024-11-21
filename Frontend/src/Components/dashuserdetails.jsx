import React, { useState } from "react";
import { MenuItem, Select, FormControl, InputLabel, Box, Typography, Paper, Chip } from "@mui/material";

const DocumentDropdown = () => {
  // Sample document data with status
  const documents = [
    {
      id: "doc1",
      name: "Document 1",
      type: "PDF",
      size: "1.2 MB",
      lastModified: "2024-11-20",
      status: "Submitted",
    },
    {
      id: "doc2",
      name: "Document 2",
      type: "Word",
      size: "820 KB",
      lastModified: "2024-11-18",
      status: "Pending",
    },
    {
      id: "doc3",
      name: "Document 3",
      type: "Excel",
      size: "2.5 MB",
      lastModified: "2024-11-15",
      status: "Submitted",
    },
  ];

  // State for selected document
  const [selectedDoc, setSelectedDoc] = useState("");

  // Handle dropdown change
  const handleDropdownChange = (event) => {
    setSelectedDoc(event.target.value);
  };

  // Find details of the selected document
  const documentDetails = documents.find((doc) => doc.id === selectedDoc);

  return (
    <Box sx={{ width: "400px", margin: "0 auto", mt: 5 }}>
      {/* Dropdown */}
      <FormControl fullWidth>
        <InputLabel>Select Document</InputLabel>
        <Select value={selectedDoc} onChange={handleDropdownChange}>
          {documents.map((doc) => (
            <MenuItem key={doc.id} value={doc.id}>
              {doc.name} -{" "}
              <Chip
                label={doc.status}
                color={doc.status === "Submitted" ? "success" : "warning"}
                size="small"
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Display Document Details */}
      {documentDetails && (
        <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6">{documentDetails.name}</Typography>
          <Typography variant="body1">
            <strong>Type:</strong> {documentDetails.type}
          </Typography>
          <Typography variant="body1">
            <strong>Size:</strong> {documentDetails.size}
          </Typography>
          <Typography variant="body1">
            <strong>Last Modified:</strong> {documentDetails.lastModified}
          </Typography>
          <Typography variant="body1">
            <strong>Status:</strong>{" "}
            <Chip
              label={documentDetails.status}
              color={documentDetails.status === "Submitted" ? "success" : "warning"}
              size="small"
            />
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default DocumentDropdown;
