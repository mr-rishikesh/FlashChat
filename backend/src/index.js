import express from "express";
import router from "./routes/auth.route.js"
import dotenv from "dotenv"
import connectDB from "./lib/db.js";

dotenv.config();

const app = express();
connectDB()
app.use(express.json())

app.use("/api/auth" , router)
const PORT = process.env.PORT
app.listen( PORT, () => {
    console.log(`App is listing at port ${PORT}`)
} )