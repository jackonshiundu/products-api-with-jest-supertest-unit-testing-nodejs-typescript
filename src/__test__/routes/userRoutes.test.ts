import User from "../../models/User.model";
import test_server from "../../../test_setup";
import request from "supertest";
import supertest from "supertest";

describe("User Toutes Test", () => {
  let adminToken: string;
  let nonAdminToken: string;
  beforeAll(async () => {
    // Create an admin user for testing
    await request(test_server).post("/api/v1/users/create").send({
      email: "admin@example.com",
      password: "adminpassword",
      username: "adminuser",
      isAdmin: true,
      savedProducts: [],
    });

    // Create a non-admin user for testing
    await request(test_server).post("/api/v1/users/create").send({
      email: "nonadmin@example.com",
      password: "nonadminpassword",
      username: "nonadminuser",
      isAdmin: false,
      savedProducts: [],
    });

    // Log in as admin to get the admin token
    const adminLoginResponse = await request(test_server)
      .post("/api/v1/users/login")
      .send({
        email: "admin@example.com",
        password: "adminpassword",
      });
    adminToken = adminLoginResponse.body.token;

    // Log in as non-admin to get the non-admin token
    const nonAdminLoginResponse = await request(test_server)
      .post("/api/v1/users/login")
      .send({
        email: "nonadmin@example.com",
        password: "nonadminpassword",
      });
    nonAdminToken = nonAdminLoginResponse.body.token;
  }, 20000);

  // Clean up after tests
  afterAll(async () => {
    // Remove the created user
    await User.deleteMany({
      $or: [
        { username: "testuser" },
        { username: "testuser1" },
        { username: "adminuser" },
        { username: "nonadminuser" },
      ],
    });

    // Clear all jest mocks
    jest.clearAllMocks();
    test_server.close();
  });
  it("Should create a new User", async () => {
    const userResponse = await request(test_server)
      .post("/api/v1/users/create")
      .send({
        email: "testuser@example.com",
        password: "adminpassword",
        username: "testuser",
        isAdmin: false,
        savedProducts: [],
      });
    expect(userResponse.status).toBe(201);
    expect(userResponse.body).toHaveProperty("email", "testuser@example.com");
    expect(userResponse.body).toHaveProperty("username", "testuser");
  });
  it("Should log in user and return a token", async () => {
    const loggedInUserResponse = await request(test_server)
      .post("/api/v1/users/login")
      .send({
        email: "admin@example.com",
        password: "adminpassword",
      });

    expect(loggedInUserResponse.status).toBe(200);
    expect(loggedInUserResponse.body).toHaveProperty("user");
    expect(loggedInUserResponse.body).toHaveProperty("token");
  });
  it("should get all users with admin access", async () => {
    // Send a request to the route with the admin token
    const response = await request(test_server)
      .get("/api/v1/users/all")
      .set("token", `Bearer ${adminToken}`);

    // Expectations
    expect(response.status).toBe(200);
    // Add more expectations based on your user data

    // Optionally, you can store the users for further assertions
    const allUsers = response.body;
  }, 20000);

  // Test case for getting all users without admin access
  it("should return 403 Forbidden when accessing all users without admin access", async () => {
    // Send a request to the route with the non-admin token
    const response = await request(test_server)
      .get("/api/v1/users/all")
      .set("token", `Bearer ${nonAdminToken}`);

    // Expectations
    expect(response.status).toBe(403);
    // Add more expectations based on how you handle non-admin access
  }, 20000);
  /*   it("should successfully update a user with valid credentials (admin or account owner)", async () => {
    // Assuming you have a test user created previously
    // If you dont have you can create one programattically like we did writing
    // Tests for create new user

    const testUser = {
      email: "testuser1@example.com",
      password: "testuserpassword",
      username: "testuser1",
    };

    // Create a test user
    const createResponse = await request(test_server)
      .get("/api/v1/users/create")
      .send(testUser);
    const userId = createResponse.body._id;
    console.log("Update test USer ID:", userId);
    // Update the user using the hardcoded token
    const updateResponse = await request(test_server)
      .put(`/api/v1/users/update/${userId}`)
      .set("token", `Bearer ${adminToken}`)
      .send({
        // Your updated user data
        username: "updateduser",
      });

    // Expectations
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toHaveProperty("username", "updateduser");
    // Add more expectations based on your updated user data
  }, 20000); */
  it("should successfully delete a user with valid credentials (admin or account owner)", async () => {
    // Assuming you have a test user created previously
    const testUser = {
      email: "testuser2@example.com",
      password: "testuserpassword",
      username: "testuser",
    };

    // Create a test user
    const createResponse = await request(test_server)
      .post("/api/v1/users/create")
      .send(testUser);

    // Get the ID of the created user
    const userId = createResponse.body._id;

    // Log the ID to check if it's correct
    console.log("User ID:", userId);

    // Delete the user using the hardcoded token
    const deleteResponse = await request(test_server)
      .delete(`/api/v1/users/delete/${userId}`)
      .set("token", `Bearer ${adminToken}`);

    // Expectations
    expect(deleteResponse.status).toBe(204);
  }, 20000);
});
