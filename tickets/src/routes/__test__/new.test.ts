import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models/tickets";

describe("Testing Creating a New Ticket", () => {
  describe("Test POST /api/tickets/new", () => {
    test("Has a route handler for /api/tickets for POST Requests", async () => {
      const res = await request(app).post("/api/tickets").send({});
      expect(res.status).not.toEqual(404);
    });

    test("Can only be accessed if the user is signed in", async () => {
      const res = await request(app).post("/api/tickets").send({});
      expect(res.status).toEqual(401);
    });

    test("Returns a status other than 401 if the user is signed in", async () => {
      const res = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({});
      expect(res.status).not.toEqual(401);
    });

    test("Returns an Error if invalid title is provided", async () => {
      await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
          title: "",
          price: 450,
        })
        .expect(400);

      await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
          price: 450,
        })
        .expect(400);
    });

    test("Returns an Error if invalid price is provided", async () => {
      await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
          title: "Ticket-1",
          price: -10,
        })
        .expect(400);

      await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
          title: "Ticket-1",
        })
        .expect(400);
    });

    test("It creates a ticket with valid inputs", async () => {

      let tickets = await Ticket.find({});
      expect(tickets.length).toEqual(0);

      await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
          title: "Ticket-1",
          price: 40.54,
        })
        .expect(201);

      tickets = await Ticket.find({});
      
      expect(tickets.length).toEqual(1);
      expect(tickets[0].price).toEqual(40.54);
    });
  });
});
