
import  Form from "../models/Form.js"


import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const add = async(req,res,next)=>{

    
   const userId=req.body.userId;
   const fullname=req.body.fullname;
   const address=req.body.address;
   const contactno=req.body.contactno;
   const dateofbirth=req.body.dateofbirth;
   const NIC=req.body.NIC;
   const DateofJoin=req.body.NIC;
   const CDSDetails=req.body.NIC;
   const status="Submitted"
   

  
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