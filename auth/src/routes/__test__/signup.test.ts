import request from "supertest";
import app from "../../app";

describe("Testing SignUP Auth Service", () => {
  describe("Test POST /api/users/signup", () => {
    const userData = {
      email: "siddhartha6916@gmail.com",
      password: "asdasdas",
    };

    const userDataWithoutEmail = {
      password: "asdasdas",
    };

    const reponseWithoutValidEmail = {
      success: false,
      errors: [
        {
          message: "Email must be valid",
          field: "email",
        },
      ],
    };

    const userDataWithoutPassword = {
      email: "siddhartha6916@gmail.com",
    };

    const reponseWithoutValidPassword = {
      success: false,
      errors: [
        {
          message: "Password must be betwen 4 to 20 characters",
          field: "password",
        },
      ],
    };

    const emptyUserData = {};
    const responseWithoutAnyData = {
      success: false,
      errors: [
        {
          message: "Email must be valid",
          field: "email",
        },
        {
          message: "Password must be betwen 4 to 20 characters",
          field: "password",
        },
      ],
    };

    const responseWithSameEmail = {
      success: false,
      errors: [
        {
          message: " Email already in use",
        },
      ],
    };

    const userResponse = {
      success: true,
      message: "Sign Up Successful",
      user: {
        email: "siddhartha6916@gmail.com",
        id: "654f85aa61c1df7383981f82",
      },
    };

    test("User Registration should respond with 201 success", async () => {
      const response = await request(app)
        .post("/api/users/signup")
        .send(userData)
        .expect("Content-Type", /json/)
        .expect(201);

      // expect(response.body).toMatchObject(userResponse);
    });

    test("When Email Not provided it should response with 400 status", async () => {
      const response = await request(app)
        .post("/api/users/signup")
        .send(userDataWithoutEmail)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toMatchObject(reponseWithoutValidEmail);
    });

    test("When Password Not provided it should response with 400 status", async () => {
      const response = await request(app)
        .post("/api/users/signup")
        .send(userDataWithoutPassword)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toMatchObject(reponseWithoutValidPassword);
    });

    test("When Password Not provided it should response with 400 status", async () => {
      const response = await request(app)
        .post("/api/users/signup")
        .send(userDataWithoutPassword)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toMatchObject(reponseWithoutValidPassword);
    });

    test("When no data provided it should response with 400 status", async () => {
      const response = await request(app)
        .post("/api/users/signup")
        .send(emptyUserData)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toMatchObject(responseWithoutAnyData);
    });

    test("When same email provided during signup", async () => {
      const response1 = await request(app)
        .post("/api/users/signup")
        .send(userData)
        .expect("Content-Type", /json/)
        .expect(201);

      const response2 = await request(app)
        .post("/api/users/signup")
        .send(userData)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response2.body).toMatchObject(responseWithSameEmail);
    });

    test("Check for Set-Cookie Header in Response", async () => {
      const response = await request(app)
        .post("/api/users/signup")
        .send(userData)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(response.get('Set-Cookie')).toBeDefined();
    });
  });
});
