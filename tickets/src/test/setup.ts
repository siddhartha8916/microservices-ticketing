import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
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

global.signin = () => {
  // Build a JSON Web Token Payload {id , email }
  const payload = {
    id: "21412244",
    email: "test@test.com",
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_SECRET!);

  // Build the Session Object {jwt:jwtToken}
  const session = { jwt: token };

  //Turn that Session in JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as Base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string that the cookie with encoded data
  // session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJalkxTlRnMk1EVXhNR1JsWm1ZMFptRm1NbU5oTkROaE9TSXNJbVZ0WVdsc0lqb2ljMmxrWkdoaGNuUm9ZVFk1TVRaQVoyMWhhV3d1WTI5dElpd2lhV0YwSWpveE56QXdNamt3TmpRNWZRLmlVOHFSU3dDdnFfZ09Mb050R2p5ZXgyQkFyWlY2NGVHUklMSzNBczJhOWsifQ==

  return [`session=${base64}`];
};
