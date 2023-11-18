import express, { Request, Response } from "express";
import { NotFoundError } from "@sid_ticketing/common";
import { Ticket } from "../models/tickets";

const router = express.Router();

router.get("/api/tickets/:ticketId", async (req: Request, res: Response) => {
  const { ticketId } = req.params;

  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw new NotFoundError();
  }

  return res.status(200).json({
    success: true,
    message: "Ticket Details",
    ticket,
  });
});

export { router as showTicketRouter };
