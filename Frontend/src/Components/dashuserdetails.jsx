import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect,  } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { MenuItem, Select, FormControl, InputLabel, Box, Typography, Paper, Chip } from "@mui/material";

const DocumentDropdown = () => {
  // Sample document data with status
  const { currentUser } = useSelector((state) => state.user);
  // State for selected document

  const [formdetails,setformdetails] = useState([])
  useEffect(() => {
    const fetchs = async () => {
      try {
        const res = await fetch('/api/form/get');
        const data = await res.json();
        if (res.ok) {
          setformdetails(data);
          console.log(data)
         
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchs();
    }
  }, []);




  return (
    <Box sx={{ width: "800px", margin: "0 auto", mt: 5 ,}}>
      <h1>User Documents - Select Documents</h1>
      {/* Dropdown */}
      <FormControl fullWidth>
      
        <Select value="Personal Histrory Form" >
          
            <MenuItem >
             PErsonal History form
              <Chip
                label="Submitted"
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
