import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models/tickets";
import mongoose from "mongoose";

describe("Testing Getting Tickets", () => {
  describe("Test GET /api/tickets/:tickedId", () => {

    test("Returns 404 if a ticket is not found", async () => {
      const fakeId = new mongoose.Types.ObjectId().toHexString()
      const res = await request(app).get(`/api/tickets/${fakeId}`).send();
      expect(res.status).toEqual(404);
    });

    test("Returns a ticket details if the ticket is found", async () => {
      const title = "Ticket-1";
      const price = 40.54;

      const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({ title, price })
        .expect(201);
      
      const ticketId = response.body.ticket.id
      const ticketResponse = await request(app)
        .get(`/api/tickets/${ticketId}`).send()
        .expect(200);
      
      expect(ticketResponse.body.ticket.title).toEqual(title)
      expect(ticketResponse.body.ticket.price).toEqual(price)
    });
  });
});
