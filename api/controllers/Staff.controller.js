
import staff from "../models/staff.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const add = async(req,res,next)=>{

    
   const Staffmembername=req.body.Staffmembername;
   
 
  
  const username=req.body.username;
  
  const password=req.body.password;
  
      const newstaffmember = new staff({
        Staffmembername,
        username,
        password,
        
        
});

      try {
        const savedmember = await newstaffmember.save();
        res.status(201).json(savedmember);
      
      } catch (error) {
        next(error);
       
      }



}


export const usersignin = async(req,res,next)=>{
  const {username,password} = req.body;
  if(!username || !password || username==="" || password===""){
    next(errorHandler(400,"All fields are required"));
  }
  try{
    const validUser = await staff.findOne({username});
    if(!validUser) return next(errorHandler(404,'User not found!'));
    let validPassword;
    if(password== validUser.password){
        validPassword = true;
    };
    if(!validPassword) return next(errorHandler(400,'Invalid Credentials!'));
    const token = jwt.sign({id:validUser._id , isAdmin:validUser.isAdmin},process.env.JWT_SECRET);
    const{password:hashedPassword, ...rest} = validUser._doc;
    const expiryDate = new Date(Date.now()+3600000);
    res.cookie('acess_token',token,{httpOnly:true,expires:expiryDate}).status(200).json({ ...rest, id: validUser._id }); ;
   
  }catch(error){
    next(error);
  }
}










export const getstaff = async(req,res,next)=>{
   

    staff.find().then((Staff)=>{
      res.json(Staff)
     
      }).catch((err)=>{
      console.log(err);
  })
  
 


}

export const Delete= async(req,res,next)=>{
   let userId = req.params.id;
  
   staff.findByIdAndDelete(userId)
.then (() => {
res.status (200).send({status: "Member deleted"})
}).catch((err) => {
console.log(err);
res.status (500). send({status: "Error with deleting data", error: err.message});
})
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

export const updatestaff= async (req, res, next) => {

  try {
    if (req.body.phonenumber) {
        const mobileRegex = /^(071|076|077|075|078|070|074|072)\d{7}$/;
        if (!mobileRegex.test(req.body.phonenumber)) {
            return next(errorHandler(400, 'Invalid mobile number format.'));
        }
    }
    const updatestaff = await staff.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
     Staffmembername:req.body.membername,
    
    Age:req.body.age,
    phonenumber:req.body.phonenumber,
    email:req.body.EmailAddress,
    address:req.body.Address,
    task:req.body.task,
 
    Picture:req.body.image,
    stafftype:req.body.type,
    salary:req.body.salary,

        },
      },
      { new: true }
    );
    res.status(200).json(updatestaff);
  } catch (error) {
    next(error);
  }
};