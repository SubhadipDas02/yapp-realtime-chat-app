import express from 'express';
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
    createGroup, 
    getUserGroups, 
    getGroupMessages, 
    sendGroupMessage, 
    addMemberToGroup,
    removeMemberFromGroup,
    leaveGroup,
    deleteGroup
} from "../controllers/group.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createGroup);
router.get("/", protectRoute, getUserGroups);
router.get("/:id/messages", protectRoute, getGroupMessages);
router.post("/:id/messages", protectRoute, sendGroupMessage); // Fix: changed from /send to /messages
router.post("/:id/add-member", protectRoute, addMemberToGroup);
router.post("/:id/remove-member", protectRoute, removeMemberFromGroup); // Add remove member route
router.post("/:id/leave", protectRoute, leaveGroup); // Add leave group route  
router.delete("/:id", protectRoute, deleteGroup); // Add delete group route

export default router;
