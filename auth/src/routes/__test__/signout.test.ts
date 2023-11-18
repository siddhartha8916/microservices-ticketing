import request from "supertest";
import app from "../../app";

describe("Testing SignOut Auth Service", () => {
  describe("Test POST /api/users/signout", () => {
    test("Should respond custom message", async () => {
      const userData = {
        email: "siddhartha6916@gmail.com",
        password: "asdasdas",
      };

      await request(app)
        .post("/api/users/signup")
        .send(userData)
        .expect("Content-Type", /json/)
        .expect(201);

      await request(app)
        .post("/api/users/signin")
        .send(userData)
        .expect("Content-Type", /json/)
        .expect(200);

      const signoutResponse = await request(app)
        .post("/api/users/signout")
        .expect("Content-Type", /json/);

      expect(signoutResponse.get("Set-Cookie")[0]).toEqual(
        "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
      );
      expect(signoutResponse.body).toMatchObject({
        success: true,
        message: "Logged Out Successfully",
      });
    });
  });
});
