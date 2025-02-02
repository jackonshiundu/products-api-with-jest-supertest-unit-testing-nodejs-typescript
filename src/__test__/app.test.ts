import mongoose from "mongoose";
import app from "../index";
import request from "supertest";

beforeAll(async () => {
  // Set up: Establish the MongoDB connection before running tests

  if (!process.env.MONGODB_URL) {
    throw new Error("MONGO_URI environment variable is not defined/set");
  }
  await mongoose.connect(process.env.MONGODB_URL);
});
afterAll(async () => {
  await mongoose.connection.close();
});
describe("GET /", () => {
  // Teardown: Close the MongoDB connection after all tests have completed
  it("Should respond with 'Hello World'", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.text).toBe("Hello world");
  });
});
