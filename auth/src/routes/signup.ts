import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { BadRequestError, validateRequest } from "@sid_ticketing/common";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be betwen 4 to 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError(" Email already in use");
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate a JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET! // We are sure when adding ! mark that the variable is already defined
    );

    // Store it on the session object
    req.session = {
      jwt: userJwt,
    };

    res
      .status(201)
      .json({ success: true, message: "Sign Up Successful", user });
  }
);

export { router as signUpRouter };
