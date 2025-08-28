import cors from "cors";
import express, { request } from "express";
import "dotenv/config";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);
// app.post("/test", async (req, res) => {});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connect to DB");
  } catch (error) {
    console.log(error);
  }
};

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
  connectDB();
});
