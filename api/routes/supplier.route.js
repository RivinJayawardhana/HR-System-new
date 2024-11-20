import express from "express";
import { 
    createSupplier, 
    deleteSupplier, 
    getAllSuppliers, 
    getSupplier, 
    updateSupplier, 
    testSupplier, 
    supplyRequest
} from "../controllers/supplier.controller.js";

const router = express.Router();

// Test route to check if the supplier routes work
router.get("/test", testSupplier);

// Route to create a new supplier
router.post("/create_supplier", createSupplier);

// Route to get all suppliers
router.get("/get_all_suppliers", getAllSuppliers);

// Route to get a specific supplier by ID
router.get("/get_a_supplier/:id", getSupplier);

// Route to update a specific supplier by ID
router.put("/update_supplier/:id", updateSupplier);

// Route to delete a specific supplier by ID
router.delete("/delete_supplier/:id", deleteSupplier);

router.post("/send-email", supplyRequest );


export default router;
