
import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({

    Staffmembername:{

        type:String,
        required:true,
        unique:true

    },

    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },




    
    contactNumber: { type: String, required: true, unique: true },
    position: { type: String, required: true, unique: true },
    

    
    forms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Form",
      },
    ],






   
   
},{timestamps:true})

const staff = mongoose.model('Staff',staffSchema);
export default staff;