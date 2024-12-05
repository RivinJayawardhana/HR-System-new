import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullname: { type: String, required: true },
  address: { type: String, required: true },
  contactno: { type: String, required: true },
  dateofbirth: { type: String, required: true },
  NIC: { type: String, required: true },
  DateofJoin: { type: String, required: true },
  CDSDetails: { type: String, required: true },

  // New fields added
  academicQualifications: [
    {
      qualification: { type: String, required: true },
      universityInstitute: { type: String, required: true },
      status: { type: String, required: true },
    },
  ],

  previousEmploymentDetails: [
    {
      employer: { type: String, required: true },
      Natureofbusiness:{ type: String, required: true },
      Positionheld:{ type: String, required: true },
      Lengthofservice:{ type: String, required: true },
    },
  ],

  civilStatus: { type: String, required: true },

  BankName: { type: String, required: true },
  BankAccNum: { type: String, required: true },
  Branch: { type: String, required: true },



  spouseDetails: [
    {
      name: { type: String, required: true },
      ID: { type: String, required: true },
      placeOfWork: { type: String, required: true },
      positionHeld: { type: String, required: true },
    },
  ],

  emergencyContact: [{
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    contactNo: { type: String, required: true },
  }
],

  status: { type: String, default: "Pending" },
  Approved: { type: String, default: "not" },
  document1: {
    type: String,
    default: "none",
  },
});

const Form = mongoose.model("Form", formSchema);
export default Form;