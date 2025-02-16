import express from "express"
import { getMessage, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const messageRouter = express.Router();

messageRouter.get("/users" , protectRoute ,  getUsersForSidebar)
messageRouter.get("/:id" , protectRoute ,  getMessage)
messageRouter.post("/send/:id" , protectRoute , sendMessage)


export default messageRouter