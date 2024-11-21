
import  Form from "../models/Form.js"


import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const add = async(req,res,next)=>{

    
   const userId=req.body.userId;
   const fullname=req.body.fullname;
   const address=req.body.address;
   const contactno=req.body.contactno;
   const dateofbirth=req.body.dateofbirth;
   const NIC=req.body.nic;
   const DateofJoin=req.body.DateofJoin;
   const CDSDetails=req.body.CDSDetails;
   const status="Submitted";
   

  
      const newForm = new Form({
        userId,
        fullname,
        address,
        contactno,
        dateofbirth,
        NIC,
        DateofJoin,
        CDSDetails,
        status
        
        
        
});



      try {
        const savedform = await newForm.save();
        res.status(201).json(savedform);
      
      } catch (error) {
        next(error);
       
      }



}



export const Getmember= async(req,res,next)=>{
    const userId= req.params.id;
    console.log(userId);
    staff.findOne({_id:userId}).then((staff)=>{
  
      if (staff){
          res.json(staff)
         } else {
          res.status(401);
          console.log("error")
          
        }
  
  })
  
  }