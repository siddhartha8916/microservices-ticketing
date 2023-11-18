import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app";

declare global {
  var signin: () => Promise<string[]>;
}

let mongod: any;

beforeAll(async () => {
  // This will create an new instance of "MongoMemoryServer" and automatically start it
  process.env.JWT_SECRET = "asdf";
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri, { dbName: "auth-db" });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongod.stop();
  await mongoose.disconnect();
});

global.signin = async () => {
  const email = "siddhartha6916@gmail.com";
  const password = "asdasdas";

  const signUpResponse = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect("Content-Type", /json/)
    .expect(201);

  const cookie = signUpResponse.get("Set-Cookie");
  return cookie;
};
