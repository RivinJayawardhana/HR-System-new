
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

console.log(newForm);

      try {
        const savedform = await newForm.save();
        res.status(201).json(savedform);
      
      } catch (error) {
        next(error);
       
      }



}