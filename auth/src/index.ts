import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import mongoose from "mongoose";

import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signUpRouter } from "./routes/signup";
import { signOutRouter } from "./routes/signout";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();

app.use(json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const startApplication = async () => {
  try {
    await mongoose.connect("mongodb://mongo-srv:27017/auth");
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error("error", error);
  }

  app.listen(3000, () => {
    console.log("Up Listening on port 3000");
  });

};

startApplication();
