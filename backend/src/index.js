import express from "express";
import router from "./routes/auth.route.js"
import messageRouter from "./routes/message.route.js";
import dotenv from "dotenv"
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser"
import cors from "cors" 
import {app , server} from "./lib/socket.js"
import path from "path";

dotenv.config();



const __dirname = path.resolve();
connectDB()
app.use(express.json({ limit: '10mb' })); 
app.use(cookieParser());
app.use(cors({
    origin : "http://localhost:5173", 
    credentials : true
}))

app.use("/api/auth" , router)
app.use("/api/messages" , messageRouter)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }

const PORT = process.env.PORT
server.listen( PORT, () => {
    console.log(`App is listing at port ${PORT}`)
} )