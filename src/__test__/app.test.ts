import app from "../index";
import request from "supertest";

describe("GET /", () => {
  it("Should respond with 'Hello World'", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.text).toBe("Hello world");
  });
});
