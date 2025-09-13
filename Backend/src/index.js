import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js";
import groupRoutes from "./routes/group.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "https://yapp-realtime-chat-app.vercel.app"], // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent with requests
}))

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);

// Health check endpoint for Render
app.get('/healthz', (req, res) => res.sendStatus(200));

server.listen(PORT, () => {
    console.log("Server is running on PORT: " + PORT);
    connectDB();
});