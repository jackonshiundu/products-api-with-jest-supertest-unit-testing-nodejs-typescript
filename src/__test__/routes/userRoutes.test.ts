import User from "../../models/User.model";
import test_server from "../../../test_setup";
import request from "supertest";

describe("User Toutes Test", () => {
  beforeAll(async () => {});

  // Clean up after tests
  afterAll(async () => {
    // Remove the created user
    await User.deleteOne({
      username: "testuser",
    });

    // Clear all jest mocks
    jest.clearAllMocks();
    test_server.close();
  });
  it("Should create a new User", async () => {
    const userResponse = await request(test_server)
      .post("/api/v1/users/create")
      .send({
        email: "admin@example.com",
        password: "adminpassword",
        username: "testuser",
        isAdmin: false,
        savedProducts: [],
      });
    expect(userResponse.status).toBe(201);
    expect(userResponse.body).toHaveProperty("email", "admin@example.com");
    expect(userResponse.body).toHaveProperty("username", "testuser");

    // Optionally, you can store the created user for future tests
    const createdUser = userResponse.body;
  });
  it("Should log in user ans return a token", async () => {
    const loggedInUserResponse = await request(test_server)
      .post("/api/v1//users/login")
      .send({
        email: "admin@example.com",
        password: "adminpassword",
      });

    expect(loggedInUserResponse.status).toBe(200);
    expect(loggedInUserResponse.body).toHaveProperty("user");
    expect(loggedInUserResponse.body).toHaveProperty("token");

    // Optionally, you can store the token for future authenticated requests
    const authToken = loggedInUserResponse.body.token;
  });
});
