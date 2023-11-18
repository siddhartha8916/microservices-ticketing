import http from "http";
import mongoose from "mongoose";
import app from "./app";

const PORT = 3000;

const server = http.createServer(app);

const startApplication = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("error", error);
  }

  server.listen(PORT, () => {
    console.log(`Server running on ${PORT}...`);
  });
};

startApplication();
