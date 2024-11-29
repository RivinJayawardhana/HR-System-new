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

  status: { type: String, default: "Pending" },
  Approved: { type: String, default: "not" },
  document1:{
    type:String,
    default:"none"
},
// Pending, Completed

});
const Form = mongoose.model('Form',formSchema);
export default Form;
