import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  supplierName: {
    type: String,
    required: true,
    trim: true,
  },
  supplierRegisterNo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  dateOfRegistration: {
    type: Date,
    required: true,
  },
  businessAddress: {
    type: String,
    required: true,
    trim: true,
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  productCategories: {
    type: [String], // Array of strings to store multiple product categories
    required: true,
    enum: ['Furniture', 'Food & beverages', 'Electric & technology', 'Cleaning & maintaining', 'Other'], // Enums to specify valid categories
  },
  isSupplier:{
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date when the supplier is created
  },
},{timestamps:true});

// Create the model from the schema
const Supplier = mongoose.model('supplier', supplierSchema);

export default Supplier;
