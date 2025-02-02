import dotenv from "dotenv";
import User, { TheUser } from "../../models/User.model";
import mongoose from "mongoose";

dotenv.config();
describe("User Model Tests", () => {
  let createdUser: TheUser;
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
  it("Should Create a new User", async () => {
    const userData: Partial<Omit<TheUser, "_id">> = {
      email: "test@gmail.com",
      username: "testuser",
      password: "testpassword",
      isAdmin: false,
      savedProducts: [],
    };

    createdUser = await User.create(userData);

    expect(createdUser.email).toBe(userData.email);
    expect(createdUser.username).toBe(userData.username);
    expect(createdUser.isAdmin).toBe(userData.isAdmin);
  }, 10000);

  //test case:Ensure email and username are unique
  it("Fail to create user with duplicate email and username", async () => {
    const userData: Partial<Omit<TheUser, "_id">> = {
      email: "test@gmail.com",
      username: "testuser",
      password: "testpassword",
      isAdmin: false,
      savedProducts: [],
    };
    try {
      //Attempt to create a user with the same email and username
      await User.create(userData);
      expect(true).toBe(false);
    } catch (error) {
      // Expect a MongoDB duplicate key error (code 11000)
      expect(error.code).toBe(11000);
    }
  }, 10000);

  it("get all users", async () => {
    const allUsers = await User.find();

    // Expectations
    const userWithoutTimestamps = {
      _id: createdUser._id,
      email: createdUser.email,
      username: createdUser.username,
      isAdmin: createdUser.isAdmin,
      savedProducts: createdUser.savedProducts,
    };

    expect(allUsers).toContainEqual(
      expect.objectContaining(userWithoutTimestamps)
    );
  });
  /* const removeMongoProps = (user: any) => {
    const { __v, _id, createdAt, updatedAt, ...cleanedUser } = user.toObject();
    return cleanedUser;
  };

  it("Should get all users", async () => {
    const allUsers = User.find();

    if (createdUser) {
      const cleanedCreatedUsers = removeMongoProps(createdUser);
      expect(allUsers).toEqual(
        expect.arrayContaining([expect.objectContaining(cleanedCreatedUsers)])
      );
    }
  }); */
  // Test Case: Update an existing user
  it("should update an existing user", async () => {
    // Check if there is a created user to update
    if (createdUser) {
      // Define updated data
      const updatedUserData: Partial<TheUser> = {
        username: "testuser",
        isAdmin: true,
      };

      // Update the user and get the updated user
      const updatedUser = await User.findByIdAndUpdate(
        createdUser._id,
        updatedUserData,
        { new: true }
      );

      // Expectations
      expect(updatedUser?.username).toBe(updatedUserData.username);
      expect(updatedUser?.isAdmin).toBe(updatedUserData.isAdmin);
    }
  });

  // Test Case: Get user by ID
  it("should get user by ID", async () => {
    // Get the created user by ID
    const retrievedUser = await User.findById(createdUser._id);

    // Expectations
    expect(retrievedUser?.email).toBe(createdUser.email);
    expect(retrievedUser?.username).toBe(createdUser.username);
    // Add other properties that you want to compare

    // For example, if updatedAt is expected to be different, you can ignore it:
    // expect(retrievedUser?.updatedAt).toBeDefined();
  });

  // Test Case: Delete an existing user
  it("should delete an existing user", async () => {
    // Delete the created user
    await User.findByIdAndDelete(createdUser._id);

    // Attempt to find the deleted user
    const deletedUser = await User.findById(createdUser._id);

    // Expectations
    expect(deletedUser).toBeNull();
  });
});
