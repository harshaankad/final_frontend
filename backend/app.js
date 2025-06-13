import { v2 as cloudinary } from "cloudinary";
import path from "path";
import express from "express"
import 'dotenv/config'
import cookieParser from "cookie-parser";
import connectDB from "./config/connect-db.js"
import corsOptions, { corsConfig } from "./config/cors.js"

const app = express()

app.use(express.json());
const PORT = process.env.PORT || 8080;


app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // For form-urlencoded data
//app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" })); // For file uploads

// Connect MongoDB
connectDB();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Routes
/*
app.use("/api", authroutes);
app.use("/api", patientroute);
app.use("/api", paymentroute);
app.use("/api", adminroute);
app.use("/api", qualificationPicroute);
*/

// Default Route
app.get("/", (req, res) => {
    res.send("API is running...");
  });

//centralized error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  export default app