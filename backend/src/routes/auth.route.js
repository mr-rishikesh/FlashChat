import express from "express";

const router = express.Router();
router.post("/login" , (req , res) => {
    res.json({hello_everyone})
})


export default router

