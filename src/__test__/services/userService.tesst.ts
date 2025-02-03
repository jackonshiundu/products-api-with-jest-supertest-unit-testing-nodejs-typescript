// Import necessary modules and models
import User, { TheUser } from "../../models/User.model"; // Import User model and TheUser type
import mongoose from "mongoose"; // Import mongoose for MongoDB connection
import * as userService from "../../services/userService"; // Import userService for user-related operations
import * as passwordUtils from "../../utils/passwordUtils"; // Import passwordUtils for password hashing and comparison
import * as jwtUtils from "../../utils/jwtUtils"; // Import jwtUtils for JWT token generation
import dotenv from "dotenv"; // Import dotenv to load environment variables

// Load environment variables from .env file
dotenv.config();

// Mock the Product model
jest.mock("../../models/Product.models", () => ({
  __esModule: true,
  default: {
    findById: jest.fn(), // Mock the findById method of the Product model
  },
}));

// Mock the populateUser function from userService
jest
  .spyOn(userService, "populateUser")
  .mockImplementation(async (user: TheUser) => {
    // Mock the behavior of populateUser function
    return user; // Return the user as is (you can replace this with your desired mock value)
  });

// Describe block for User Service Tests
describe("User Service Tests", () => {
  let createdUser: TheUser; // Variable to store the created user for later use in tests

  // Clean up after tests
  beforeAll(async () => {
    // Set up: Establish the MongoDB connection before running tests
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL environment variable is not defined/set");
    }

    await mongoose.connect(process.env.MONGODB_URL); // Connect to MongoDB using the URL from environment variables
  });

  afterAll(async () => {
    // Remove the created user
    await User.deleteMany(); // Delete all users from the database

    // Teardown: Close the MongoDB connection after all tests have completed
    await mongoose.connection.close(); // Close the MongoDB connection

    // Clear all jest mocks
    jest.clearAllMocks(); // Clear all mocks to ensure no interference between tests
  });

  // Mock the hashPassword function from passwordUtils
  jest
    .spyOn(passwordUtils, "hashPassword")
    .mockImplementation(async (password) => {
      // Mocked hash implementation
      return password + "_hashed"; // Return the password with "_hashed" appended
    });

  // Mock the jwtUtils' generateToken function
  jest
    .spyOn(jwtUtils, "generateToken")
    .mockImplementation(() => "mocked_token"); // Return a mocked token

  // Test Case: Create a new user
  it("should create a new user", async () => {
    const userData: Partial<TheUser> = {
      email: "test2@example.com",
      username: "testuser",
      password: "testpassword",
      isAdmin: false,
      savedProducts: [],
    };

    // Call the createUser function from userService with the user data
    createdUser = await userService.createUser(userData as TheUser);

    // Expectations
    expect(createdUser.email).toBe(userData.email); // Check if the email matches
    expect(createdUser.username).toBe(userData.username); // Check if the username matches
    expect(createdUser.isAdmin).toBe(userData.isAdmin); // Check if the isAdmin flag matches
    expect(passwordUtils.hashPassword).toHaveBeenCalledWith(userData.password); // Check if hashPassword was called with the correct password
  }, 30000); // Timeout for the test set to 30 seconds

  // Test Case: Create a new user (duplicate test case, consider removing or modifying)
  it("should create a new user", async () => {
    const userData: Partial<TheUser> = {
      email: "test@example.com",
      username: "testuser",
      password: "testpassword",
      isAdmin: false,
      savedProducts: [],
    };

    // Call the createUser function from userService with the user data
    createdUser = await userService.createUser(userData as TheUser);

    // Expectations
    expect(createdUser.email).toBe(userData.email); // Check if the email matches
    expect(createdUser.username).toBe(userData.username); // Check if the username matches
    expect(createdUser.isAdmin).toBe(userData.isAdmin); // Check if the isAdmin flag matches
    expect(passwordUtils.hashPassword).toHaveBeenCalledWith(userData.password); // Check if hashPassword was called with the correct password
  }, 30000); // Timeout for the test set to 30 seconds

  // Test Case: Login user
  it("should login a user and generate a token", async () => {
    // Mock user data for login
    const loginEmail = "test@example.com";
    const loginPassword = "testpassword";

    // Mock the comparePassword function from passwordUtils
    jest
      .spyOn(passwordUtils, "comparePassword")
      .mockImplementation(async (inputPassword, hashedPassword) => {
        // Mocked comparison logic
        return inputPassword === hashedPassword.replace("_hashed", "");
      });

    // Call the loginUser function from userService with the login credentials
    const { user, token } = await userService.loginUser(
      loginEmail,
      loginPassword
    );

    // Expectations
    expect(user.email).toBe(createdUser.email); // Check if the email matches
    expect(user.username).toBe(createdUser.username); // Check if the username matches
    expect(user.isAdmin).toBe(createdUser.isAdmin); // Check if the isAdmin flag matches
    expect(jwtUtils.generateToken).toHaveBeenCalledWith({
      id: createdUser._id.toString(),
      username: createdUser.username,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
    }); // Check if generateToken was called with the correct user data
    expect(token).toBe("mocked_token"); // Check if the token matches the mocked token
  }, 20000); // Timeout for the test set to 20 seconds

  // Helper function to remove MongoDB-specific properties from a user object
  const removeMongoProps = (user: any) => {
    const { __v, _id, createdAt, updatedAt, ...cleanedUser } = user.toObject();
    return cleanedUser; // Return the user object without MongoDB-specific properties
  };

  // Test Case: Get all users
  it("should get all users", async () => {
    // Fetch all users from the database using the getAllUsers function from userService
    const allUsers = await userService.getAllUsers();

    // If there is a created user, expect the array to contain an object
    // that partially matches the properties of the createdUser
    if (createdUser) {
      const cleanedCreatedUser = removeMongoProps(createdUser); // Remove MongoDB-specific properties

      expect(allUsers).toEqual(
        expect.arrayContaining([expect.objectContaining(cleanedCreatedUser)])
      ); // Check if the created user is in the list of all users
    }
  }, 20000); // Timeout for the test set to 20 seconds

  // Test Case: Delete an existing user
  it("should delete an existing user", async () => {
    // Delete the created user using the User model's findByIdAndDelete method
    await User.findByIdAndDelete(createdUser._id);

    // Attempt to find the deleted user
    const deletedUser = await User.findById(createdUser._id);

    // Expectations
    expect(deletedUser).toBeNull(); // Check if the deleted user is null (i.e., not found)
  });
});
