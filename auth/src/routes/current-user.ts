import express, { Request, Response } from "express";
import { currentUser, requireAuth } from "@sid_ticketing/common";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  currentUser,
  // requireAuth,
  (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: "Current User Details",
      currentUser: req.currentUser || null,
    });
  }
);

export { router as currentUserRouter };
