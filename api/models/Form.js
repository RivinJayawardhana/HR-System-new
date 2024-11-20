import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: "Pending" }, // Pending, Completed
  file: { type: String }, // File path if uploaded
  textData: { type: String }, // For text-based forms
});

module.exports = mongoose.model("Form", formSchema);
