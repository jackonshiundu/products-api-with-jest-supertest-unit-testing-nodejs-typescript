// Import necessary modules
import dotenv from "dotenv"; // For loading environment variables from a .env file
import User, { TheUser } from "../../models/User.model"; // Import the User model and its type definition
import mongoose from "mongoose"; // MongoDB ODM (Object Data Modeling) library

// Load environment variables from the .env file into process.env
dotenv.config();

// Describe block for grouping all User model-related tests
describe("User Model Tests", () => {
  let createdUser: TheUser; // Variable to store the created user for use across multiple tests

  // Before all tests, establish a connection to the MongoDB database
  beforeAll(async () => {
    // Check if the MONGODB_URL environment variable is set
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGO_URI environment variable is not defined/set");
    }
    // Connect to the MongoDB database using the URL from the environment variables
    await mongoose.connect(process.env.MONGODB_URL);
  });

  // After all tests, close the MongoDB connection to clean up resources
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test Case: Create a new user
  it("Should Create a new User", async () => {
    // Define the user data to be used for creating a new user
    const userData: Partial<Omit<TheUser, "_id">> = {
      email: "test@gmail.com",
      username: "testuser",
      password: "testpassword",
      isAdmin: false,
      savedProducts: [],
    };

    // Create a new user in the database using the User model
    createdUser = await User.create(userData);

    // Assertions to verify that the created user matches the input data
    expect(createdUser.email).toBe(userData.email);
    expect(createdUser.username).toBe(userData.username);
    expect(createdUser.isAdmin).toBe(userData.isAdmin);
  }, 10000); // Set a timeout of 10 seconds for this test

  // Test Case: Ensure email and username are unique (fail to create a user with duplicate email and username)
  it("Fail to create user with duplicate email and username", async () => {
    // Define the same user data as above to attempt creating a duplicate user
    const userData: Partial<Omit<TheUser, "_id">> = {
      email: "test@gmail.com",
      username: "testuser",
      password: "testpassword",
      isAdmin: false,
      savedProducts: [],
    };

    try {
      // Attempt to create a user with the same email and username (should fail)
      await User.create(userData);
      // If the above line does not throw an error, force the test to fail
      expect(true).toBe(false);
    } catch (error) {
      // Expect a MongoDB duplicate key error (code 11000)
      expect(error.code).toBe(11000);
    }
  }, 10000); // Set a timeout of 10 seconds for this test

  // Test Case: Get all users
  it("get all users", async () => {
    // Fetch all users from the database
    const allUsers = await User.find();

    // Create a user object without Mongoose-specific properties (timestamps, __v, etc.)
    const userWithoutTimestamps = {
      _id: createdUser._id,
      email: createdUser.email,
      username: createdUser.username,
      isAdmin: createdUser.isAdmin,
      savedProducts: createdUser.savedProducts,
    };

    // Assert that the list of all users contains the created user
    expect(allUsers).toContainEqual(
      expect.objectContaining(userWithoutTimestamps)
    );
  });

  // Helper function to remove Mongoose-specific properties from a user object
  const removeMongoProps = (user: any) => {
    const { __v, _id, createdAt, updatedAt, ...cleanedUser } = user.toObject();
    return cleanedUser;
  };

  // Test Case: Get all users and verify the created user is included (using the helper function)
  it("Should get all users", async () => {
    // Fetch all users from the database
    const allUsers = await User.find();

    // If a user was created, clean its properties and verify it exists in the list of all users
    if (createdUser) {
      const cleanedCreatedUsers = removeMongoProps(createdUser);
      expect(allUsers).toEqual(
        expect.arrayContaining([expect.objectContaining(cleanedCreatedUsers)])
      );
    }
  });

  // Test Case: Update an existing user
  it("should update an existing user", async () => {
    // Check if there is a created user to update
    if (createdUser) {
      // Define the updated data for the user
      const updatedUserData: Partial<TheUser> = {
        username: "testuser",
        isAdmin: true,
      };

      // Update the user in the database and fetch the updated user
      const updatedUser = await User.findByIdAndUpdate(
        createdUser._id,
        updatedUserData,
        { new: true } // Return the updated document
      );

      // Assertions to verify that the user was updated correctly
      expect(updatedUser?.username).toBe(updatedUserData.username);
      expect(updatedUser?.isAdmin).toBe(updatedUserData.isAdmin);
    }
  });

  // Test Case: Get a user by ID
  it("should get user by ID", async () => {
    // Fetch the created user by its ID
    const retrievedUser = await User.findById(createdUser._id);

    // Assertions to verify that the retrieved user matches the created user
    expect(retrievedUser?.email).toBe(createdUser.email);
    expect(retrievedUser?.username).toBe(createdUser.username);
    // Add other properties that you want to compare
  });

  // Test Case: Delete an existing user
  it("should delete an existing user", async () => {
    // Delete the created user from the database
    await User.findByIdAndDelete(createdUser._id);

    // Attempt to fetch the deleted user
    const deletedUser = await User.findById(createdUser._id);

    // Assertion to verify that the user was deleted (should return null)
    expect(deletedUser).toBeNull();
  });
});
