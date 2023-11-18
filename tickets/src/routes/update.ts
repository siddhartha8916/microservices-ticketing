import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  NotAuthorizedError,
} from "@sid_ticketing/common";
import { Ticket } from "../models/tickets";

const router = express.Router();

router.put(
  "/api/tickets/:ticketId",
  requireAuth,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.params;
    const { title, price } = req.body;

    if (!ticketId) {
      throw new NotFoundError();
    }

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req?.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({ title, price });
    await ticket.save()

    return res.status(200).json({
      success: true,
      message: "Ticket Updated",
      ticket,
    });
  }
);

export { router as updateTicketRouter };
