import UserModel from "../../models/User.model";
import test_server from "../../../test_setup";
import request from "supertest";

describe("User Routes", () => {
  let adminToken: string;

  beforeAll(async () => {
    // Create an admin user for testing
    await request(test_server).post("/api/v1/users/create").send({
      email: "admin@example.com",
      password: "adminpassword",
      username: "adminuser",
      isAdmin: true,
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
  });

  // Clean up after tests
  afterAll(async () => {
    await UserModel.deleteMany({
      $or: [{ username: "adminuser" }],
    });
    test_server.close();
  });

  // Test case: Should successfully create a new product with valid admin credentials
  it("should successfully create a new product with valid admin credentials", async () => {
    const testProduct = {
      title: "Test Product",
      description: "This is a test product",
      image: "test-image.jpg",
      category: "Test Category",
      quantity: "10",
      inStock: true,
    };

    const createResponse = await request(test_server)
      .post("/api/v1/products/create")
      .set("token", `Bearer ${adminToken}`) // Use "Authorization" header
      .send(testProduct);

    console.log("Create Product Response:", createResponse.body); // Debugging

    // Expectations
    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty("title", "Test Product");
  }, 20000);

  // Test case: Should successfully get all products without authentication
  it("should successfully get all products without authentication", async () => {
    const response = await request(test_server).get("/api/v1/products/all");

    console.log("Get All Products Response:", response.body); // Debugging

    // Expectations
    expect(response.status).toBe(200);
  }, 20000);

  // Test case: Should successfully get a product by ID with a valid token
  it("should successfully get a product by ID with a valid token", async () => {
    // Create a product first to get its ID
    const createResponse = await request(test_server)
      .post("/api/v1/products/create")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Test Product",
        description: "This is a test product",
        image: "test-image.jpg",
        category: "Test Category",
        quantity: "10",
        inStock: true,
      });

    const productId = createResponse.body._id;

    const response = await request(test_server)
      .get(`/api/v1/products/${productId}`)
      .set("token", `Bearer ${adminToken}`);

    console.log("Get Product by ID Response:", response.body); // Debugging

    // Expectations
    expect(response.status).toBe(200);
  }, 20000);

  // Test case: Should successfully update a product by ID with admin access
  it("should successfully update a product by ID with admin access", async () => {
    // Create a product first to get its ID
    const createResponse = await request(test_server)
      .post("/api/v1/products/create")
      .set("token", `Bearer ${adminToken}`)
      .send({
        title: "Test Product",
        description: "This is a test product",
        image: "test-image.jpg",
        category: "Test Category",
        quantity: "10",
        inStock: true,
      });

    const productId = createResponse.body._id;

    const updatedProductData = {
      title: "Updated Product",
      description: "Updated Product Description",
    };

    const response = await request(test_server)
      .put(`/api/v1/products/update/${productId}`)
      .set("token", `Bearer ${adminToken}`)
      .send(updatedProductData);

    console.log("Update Product Response:", response.body); // Debugging

    // Expectations
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("title", "Updated Product");
  }, 20000);

  // Test case: Should successfully delete a product by ID with admin access
  it("should successfully delete a product by ID with admin access", async () => {
    // Create a product first to get its ID
    const createResponse = await request(test_server)
      .post("/api/v1/products/create")
      .set("token", `Bearer ${adminToken}`)
      .send({
        title: "Test Product",
        description: "This is a test product",
        image: "test-image.jpg",
        category: "Test Category",
        quantity: "10",
        inStock: true,
      });

    const productId = createResponse.body._id;

    const response = await request(test_server)
      .delete(`/api/v1/products/delete/${productId}`)
      .set("token", `Bearer ${adminToken}`);

    console.log("Delete Product Response:", response.status); // Debugging

    // Expectations
    expect(response.status).toBe(204);
  }, 20000);
});
