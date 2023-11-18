import request from "supertest";
import app from "../../app";

describe("Testing CurrentUser Auth Service", () => {
  describe("Test POST /api/users/currentuser", () => {
    test("Current User should response with user details if valid token present", async () => {
      const cookie = await signin();

      const currentUserReponse = await request(app)
        .get("/api/users/currentuser")
        .set("Cookie", cookie) // Set cookie in another response
        .expect(200);

      expect(currentUserReponse.body.currentUser.email).toEqual(
        "siddhartha6916@gmail.com"
      );
    });

    test("Current User should response with null if no token present", async () => {
      const currentUserReponse = await request(app)
        .get("/api/users/currentuser")
        .expect(200);

      expect(currentUserReponse.body.currentUser).toEqual(null);
    });
  });
});
