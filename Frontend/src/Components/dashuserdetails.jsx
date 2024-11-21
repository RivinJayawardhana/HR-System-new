import React, { useState } from "react";
import { MenuItem, Select, FormControl, InputLabel, Box, Typography, Paper, Chip } from "@mui/material";

const DocumentDropdown = () => {
  // Sample document data with status

  // State for selected document
  const [selectedDoc, setSelectedDoc] = useState("");

  // Handle dropdown change
  const handleDropdownChange = (event) => {
    setSelectedDoc(event.target.value);
  };

  // Find details of the selected document


  return (
    <Box sx={{ width: "800px", margin: "0 auto", mt: 5 ,}}>
      <h1>User Documents - Select Documents</h1>
      {/* Dropdown */}
      <FormControl fullWidth>
      
        <Select value="Personal Histrory Form" >
          
            <MenuItem >
             PErsonal History form
              <Chip
                label="status"
                color={"Submitted" === "Submitted" ? "success" : "warning"}
                size="small"
              />
            </MenuItem>
    
        </Select>
      </FormControl>

      {/* Display Document Details */}
   
        <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6"></Typography>
          <Typography variant="body1">
            <strong>Type:</strong> 
          </Typography>
          <Typography variant="body1">
            <strong>Size:</strong> 
          </Typography>
          <Typography variant="body1">
            <strong>Last Modified:</strong> 
          </Typography>
          <Typography variant="body1">
            <strong>Status:</strong>{" "}
            <Chip
              label="Personal History form"
              color={"Submitted" === "Submitted" ? "success" : "warning"}
              size="small"
            />
          </Typography>
        </Paper>
   
    </Box>
  );
};

export default DocumentDropdown;
