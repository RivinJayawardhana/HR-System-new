import express from "express";
import { add,Getform } from "../controllers/form.controller.js";


const router = express.Router();

router.post("/add",add);
router.get('/get/:id',Getform);


export default router;