import express from "express";
import { add } from "../controllers/form.controller.js";


const router = express.Router();

router.post("/add",add);


export default router;