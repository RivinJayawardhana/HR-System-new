
import staff from "../models/staff.model.js";
import { errorHandler } from "../utils/error.js";

export const add = async(req,res,next)=>{

    if (req.body.number) {
        const mobileRegex = /^(071|076|077|075|078|070|074|072)\d{7}$/;
        if (!mobileRegex.test(req.body.number)) {
            return next(errorHandler(400, 'Invalid mobile number format.'));
        }
    }
   const Staffmembername=req.body.membername;
   
   const Age=Number(req.body.age);
  
   const email=req.body.email;
   const address=req.body.Address;
   const task=req.body.task;
   const phonenumber=req.body.number;
  const Picture=req.body.image;
  const stafftype=req.body.type;
  const salary=req.body.salary;
  
      const newstaffmember = new staff({
        Staffmembername,
        Age,
        phonenumber,
        email,
        address,
     
     
        task,
       
        Picture,
        stafftype,
        salary,
        
});

      try {
        const savedmember = await newstaffmember.save();
        res.status(201).json(savedmember);
      
      } catch (error) {
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