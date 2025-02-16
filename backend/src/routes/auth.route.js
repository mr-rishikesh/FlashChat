import express from "express";
import {signUp , logIn , logOut ,checkAuth , updateProfile} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/signup" , signUp)
router.post("/login" , logIn)
router.post("/logout" , logOut)
router.put("/update-profile" , protectRoute , updateProfile)
router.get("/check" , protectRoute , checkAuth)


export default router

