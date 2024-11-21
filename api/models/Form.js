import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullname: { type: String, required: true },
  address: { type: String, required: true },
  contactno: { type: String, required: true },
  dateofbirth: { type: String, required: true },
  NIC: { type: String, required: true },
  DateofJoin: { type: String, required: true },
  CDSDetails: { type: Boolean, required: true },

  status: { type: String, default: "Pending" }, // Pending, Completed

});

module.exports = mongoose.model("Form", formSchema);
