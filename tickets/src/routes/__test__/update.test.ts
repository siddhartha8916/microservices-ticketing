import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";

const createTicket = () => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "Ticket-1",
      price: 40.54,
    })
    .expect(201);
};

describe("Testing Updating A Ticket", () => {
  describe("Test PUT /api/tickets", () => {
    test("Returns a 404 if the provided ID doesnot exist", async () => {
      const fakeId = new mongoose.Types.ObjectId().toHexString();

      await request(app)
        .put(`/api/tickets/${fakeId}`)
        .set("Cookie", global.signin())
        .send({ title: "Ticket-1", price: 400 })
        .expect(404);
    });

    test("Returns a 401 if the user is not authenticated", async () => {
      const fakeId = new mongoose.Types.ObjectId().toHexString();

      await request(app)
        .put(`/api/tickets/${fakeId}`)
        .send({ title: "Ticket-1", price: 400 })
        .expect(401);
    });

    test("Returns a 401 if the user doesnot own the ticket", async () => {
      const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({ title: "Ticket-1", price: 400 })
        .expect(201);

      const ticketId = response.body.ticket.id;

      await request(app)
        .put(`/api/tickets/${ticketId}`)
        .set("Cookie", global.signin())
        .send({ title: "Ticket-2", price: 500 })
        .expect(401);
    });

    test("Returns a 400 if the user doesnot provide a valid price and title", async () => {
      const cookie = global.signin();
      const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({ title: "Ticket-1", price: 400 })
        .expect(201);

      const ticketId = response.body.ticket.id;

      await request(app)
        .put(`/api/tickets/${ticketId}`)
        .set("Cookie", cookie)
        .send({ title: "", price: 400 })
        .expect(400);

      await request(app)
        .put(`/api/tickets/${ticketId}`)
        .set("Cookie", cookie)
        .send({ title: "Valid Title", price: -400 })
        .expect(400);
    });

    test("It updates a ticket provided valid input", async () => {
      const cookie = global.signin();

      const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({ title: "Ticket-1", price: 400 })
        .expect(201);

      const ticketId = response.body.ticket.id;

      await request(app)
        .put(`/api/tickets/${ticketId}`)
        .set("Cookie", cookie)
        .send({ title: "Ticket-2", price: 400 })
        .expect(200);

      const ticketResponse = await request(app)
        .get(`/api/tickets/${ticketId}`)
        .send()
        .expect(200);

      expect(ticketResponse.body.ticket.title).toEqual("Ticket-2");
      expect(ticketResponse.body.ticket.price).toEqual(400);
    });
  });
});
