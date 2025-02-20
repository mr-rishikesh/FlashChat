import express from "express";
import router from "./routes/auth.route.js"
import messageRouter from "./routes/message.route.js";
import dotenv from "dotenv"
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config();



const app = express();
connectDB()
app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin : "http://localhost:5173", 
    credentials : true
}))

app.use("/api/auth" , router)
app.use("/api/message" , messageRouter)
const PORT = process.env.PORT
app.listen( PORT, () => {
    console.log(`App is listing at port ${PORT}`)
} )