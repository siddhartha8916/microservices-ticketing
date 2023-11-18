import request from "supertest";
import app from "../../app";

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

describe("Testing Getting All Tickets", () => {
  describe("Test GET /api/tickets", () => {
    test("Can fetch a list of all tickets", async () => {
      await createTicket()
      await createTicket()
      await createTicket()

      const response = await request(app).get("/api/tickets").send().expect(200)
      expect(response.body.tickets.length).toEqual(3)
    });
  });
});
