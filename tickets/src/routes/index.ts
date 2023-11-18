import express, { Request, Response } from "express"; 
import { Ticket } from "../models/tickets";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});

  return res.status(200).json({
    success: true,
    message: "Ticket Details",
    tickets,
  });
});

export { router as indexTicketRouter };
