import express from "express";
import { add,Getform,updateform } from "../controllers/form.controller.js";


const router = express.Router();

router.post("/add",add);
router.post("/add",add);
router.get('/get/:id',Getform);
router.put('/update/:id',updateform);



export default router;