
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
   const document1=req.body.document1;
   
 const newForm = new Form({
        userId,
        fullname,
        address,
        contactno,
        dateofbirth,
        NIC,
        DateofJoin,
        CDSDetails,
        status,
        document1        
});



      try {
        const savedform = await newForm.save();
        res.status(201).json(savedform);
      
      } catch (error) {
        next(error);
       
      }



}



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