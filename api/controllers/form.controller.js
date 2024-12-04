
import  Form from "../models/Form.js"


import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const add = async (req, res, next) => {
  const {
      userId,
      fullname,
      address,
      contactno,
      dateofbirth,
      NIC,
      DateofJoin,
      CDSDetails,
      academicQualifications,
      previousEmploymentDetails,
      civilStatus,
      spouseDetails,
      emergencyContact,
      document1
  } = req.body;

  // Default values for new fields
  const status = "Submitted";

  // Construct the form data object with all fields
  const newForm = new Form({
      userId,
      fullname,
      address,
      contactno,
      dateofbirth,
      NIC,
      DateofJoin,
      CDSDetails,
      academicQualifications: academicQualifications || [],
      previousEmploymentDetails: previousEmploymentDetails || [],
      civilStatus,
      spouseDetails: spouseDetails || [],
      emergencyContact: emergencyContact || [],
      status,
      document1
  });

  try {
      const savedForm = await newForm.save();
      res.status(201).json(savedForm);
  } catch (error) {
      next(error);
      console.log(error);
  }
};



export const Getform= async(req,res,next)=>{
    const userId= req.params.id;
   // console.log(userId);
    Form.findOne({userId:userId}).then((Form)=>{
  
      if (Form){
          res.json(Form)
         } else {
          res.status(401);
          console.log("error")
          
        }
  
  })
  
  }


  export const updateform= async (req, res, next) => {
     
    try {
    
      const updateform = await Form.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
             userId:req.body.userId,
             fullname:req.body.fullname,
             address:req.body.address,
             contactno:req.body.contactno,
             dateofbirth:req.body.dateofbirth,
             NIC:req.body.nic,
             DateofJoin:req.body.DateofJoin,
             CDSDetails:req.body.CDSDetails,
             status:"Submitted",
             document1:req.body.document1,
             civilStatus: req.body.civilStatus,
             academicQualifications:req.body.academicQualifications,
             previousEmploymentDetails:req.body.previousEmploymentDetails,
             spouseDetails:req.body.spouseDetails,
             emergencyContact:req.body.emergencyContact,

  
          },
        },
        { new: true }
      );
      res.status(200).json(updateform);
    } catch (error) {
      next(error);
      console.log(error)
    }
  };