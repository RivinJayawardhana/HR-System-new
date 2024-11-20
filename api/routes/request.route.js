import express from "express";
import { addCommentToRequestAdmin, addCommentToRequestStudent, createRequest, deleteRequest, getAllRequests, getOnlyOneRequest, test, updateTheStatus } from "../controllers/request.controller.js";

const router = express.Router();

router.get("/test",test);
router.post("/place_clean_req",createRequest);
router.get("/get_all_req", getAllRequests);
router.put("/add_comment_stu/:id", addCommentToRequestStudent);
router.put("/add_comment_admin/:id", addCommentToRequestAdmin);
router.delete("/delete_req/:id",deleteRequest);
router.put("/update_status/:id", updateTheStatus);
router.get("/get_request/:id", getOnlyOneRequest);


export default router;