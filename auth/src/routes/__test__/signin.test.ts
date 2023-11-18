import request from "supertest";
import app from "../../app";

describe("Testing SignIn Auth Service", () => {
  describe("Test POST /api/users/signin", () => {
    test("User SignIn should respond with 200 success", async () => {

      const userData = {
        email: "siddhartha6916@gmail.com",
        password: "asdasdas",
      };

      const signUpResponse = await request(app)
        .post("/api/users/signup")
        .send(userData)
        .expect("Content-Type", /json/)
        .expect(201);

      const signInReponse = await request(app)
        .post("/api/users/signin")
        .send(userData)
        .expect("Content-Type", /json/)
        .expect(200);

    });
  });
});
