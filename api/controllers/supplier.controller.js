import Supplier from "../models/supplier.model.js";
import { errorHandler } from "../utils/error.js";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Test route
export const testSupplier = (req, res) => {
    res.json({ msg: "Supplier works" });
};

// Create a new supplier
export const createSupplier = async (req, res, next) => {
    const { supplierName, supplierRegisterNo, dateOfRegistration, businessAddress, contactNumber, email, productCategories } = req.body;

    // Ensure required fields are provided
    if (!supplierName || !supplierRegisterNo || !dateOfRegistration || !businessAddress || !contactNumber || !email || !productCategories.length) {
        return next(errorHandler(400, 'Please provide all required fields: supplierName, supplierRegisterNo, dateOfRegistration, businessAddress, contactNumber, email, and productCategories.'));
    }

    // Create a new supplier instance
    const newSupplier = new Supplier({
        supplierName,
        supplierRegisterNo,
        dateOfRegistration,
        businessAddress,
        contactNumber,
        email,
        productCategories
    });

    try {
        const savedSupplier = await newSupplier.save();
        res.status(201).json(savedSupplier); // Successfully created supplier
    } catch (error) {
        next(error);  // Pass error to middleware
    }
};

// Get all suppliers
export const getAllSuppliers = async (req, res, next) => {
    try {
        const suppliers = await Supplier.find();
        res.json(suppliers);  // Return all suppliers
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a specific supplier by ID
export const getSupplier = async (req, res, next) => {
    try {
        const supplierId = req.params.id;
        const supplier = await Supplier.findById(supplierId);

        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }

        res.json(supplier);  // Return the supplier
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a supplier by ID
export const updateSupplier = async (req, res, next) => {
    const supplierId = req.params.id;
    const { isSupplier } = req.body; // Only updating the isSupplier field

    try {
        // Update only the isSupplier field
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            supplierId,
            { isSupplier },  // Only update isSupplier field
            { new: true }    // Return the updated document
        );

        if (!updatedSupplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }

            // If the status is now true (approved), send email
        if (isSupplier) {
            await sendApprovalEmail(updatedSupplier.email, updatedSupplier.supplierName, updatedSupplier.productCategories);
        }
        
        res.status(200).json(updatedSupplier);  // Return the updated supplier
    } catch (error) {
        next(error);
    }
};

export const supplyRequest = async (req,res,next) => {
    const { email, supplierName, message } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: `Message to ${supplierName}`,
      text:`Dear ${supplierName},\n\nI hope this message finds you well. I am writing in regard to your supplier account with us. We are currently in need of the following items:\n\n **`+ message +`\n\nPlease let me know the availability of these items and provide any relevant details, including pricing and delivery timelines. Should you require any further information or clarification, feel free to reach out.\n\nThank you for your prompt attention to this request. I look forward to your response.\n\nBest regards,\n${process.env.EMAIL_USERNAME}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).send('Email sent successfully');
      }
    });
  } catch (err) {
    return res.status(500).send('Error in sending email');
  }

};


// Delete a supplier by ID
export const deleteSupplier = async (req, res, next) => {
    const supplierId = req.params.id;

    try {
        const deletedSupplier = await Supplier.findByIdAndDelete(supplierId);

        if (!deletedSupplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }

        res.status(200).json('The supplier has been deleted');
    } catch (error) {
        next(error);
    }
};

//send approved email to the supplier

const sendApprovalEmail = async (email, supplierName, productCategories) => {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Your Booking Request has been Approved!',
      text: `Hello ${supplierName},\n\nWe are pleased to inform you that your supplier registration for the following product categories: ${productCategories.join(' , '
      )} has been approved.\n\nThank you for joining us!\n\nBest regards,\nThe Company Team`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully to:', email);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  
  
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any email service, this example is for Gmail
    auth: {
      user: process.env.EMAIL_USERNAME, // Your email from the .env file
      pass: process.env.EMAIL_PASSWORD, // Your app-specific password from the .env file
    },
  });
  
    
