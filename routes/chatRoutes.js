import express from "express";
const router = express.Router();
import { accessChat, fetchChat, createGroup, renameGroup, addToGroup, removeFromGroup, joinGroup, leaveGroup, deleteGroup, numberOfUsers } from "../controllers/chatControllers.js";


// 1. Accessing One to One Chat or creating it if it doesn't exist 
router.route(`/`).post(accessChat);
// 2. Fetching all Chats of the User if i.e inbox 
router.route(`/get`).get(fetchChat);
// 3. Creating a Group Chat 
router.route(`/group`).post(createGroup);
// 4. Renaming the Group Chat
router.route(`/rename`).put(renameGroup);
// 5. Adding a User to the Group 
router.route(`/add`).put(addToGroup);
// 6. Removing User from the Group 
router.route(`/remove`).put(removeFromGroup);
// 7. Joining a Group Chat 
router.route(`/join`).put(joinGroup);
// 8. Leave a Group Chat 
router.route(`/leave`).put(leaveGroup);
// 9. Delete Group
router.route(`/delete`).put(deleteGroup);
// Total Users in a Group 
router.route(`/userCount`).get(numberOfUsers);

export default router;

