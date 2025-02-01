import User, { TheUser } from "models/User.model";
import { generateToken } from "utils/jwtUtils";
import { comparePassword, hashPassword } from "utils/passwordUtils";

// Create a new user with the given input and hashed password
export const createUSer = async (userInput: TheUser): Promise<TheUser> => {
  try {
    // Hash the user's password before saving it
    const hashedPassword = await hashPassword(userInput.password);

    // Create a new user with the provided input and hashed password
    const newUser = await User.create({
      ...userInput,
      password: hashedPassword,
    });

    // Return the newly created user
    return newUser;
  } catch (error) {
    // Handle errors during user creation
    throw new Error(`Error creating user: ${error.message}`);
  }
};

// Log in a user by checking the provided credentials and returning a JWT token
export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: Omit<TheUser, "password">; token: string }> => {
  try {
    // Find the user by their email
    const user = await User.findOne({ email });

    // If no user is found, throw an error
    if (!user) {
      throw new Error("User not found");
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Generate a JWT token with user details
    const token = generateToken({
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });

    // Remove the password field from the user data
    const { password: _password, ...userData } = user.toObject();

    // Return the user data (without password) and the generated token
    return { user: userData as Omit<TheUser, "password">, token };
  } catch (error) {
    // Handle errors during user login
    throw new Error(`Error logging in: ${error.message}`);
  }
};

// Retrieve all users from the database
export const getAllUsers = async (): Promise<TheUser[]> => {
  try {
    // Fetch all users
    const users = await User.find();

    // Return the list of users
    return users;
  } catch (error) {
    // Handle errors during fetching users
    throw new Error(`Error getting users: ${error.message}`);
  }
};

// Retrieve a user by their ID, including their saved products
export const getUserById = async (userId: string): Promise<IUser | null> => {
  try {
    // Find the user by their ID and populate their savedProducts field
    const user = await User.findById(userId).populate("savedProducts");

    // Return the found user (or null if not found)
    return user;
  } catch (error) {
    // Handle errors during fetching the user
    throw new Error(`Error getting user: ${error.message}`);
  }
};

// Update a user's information by their ID
export const updateUser = async (
  userId: string,
  updatedUser: Partial<TheUser>
): Promise<TheUser | null> => {
  try {
    // Find the user by their ID and update their details
    const user = await User.findByIdAndUpdate(userId, updatedUser, {
      new: true, // Return the updated user
    });

    // Return the updated user
    return user;
  } catch (error) {
    // Handle errors during user update
    throw new Error(`Error updating user: ${error.message}`);
  }
};

// Delete a user by their ID
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    // Delete the user by their ID
    await User.findByIdAndDelete(userId);
  } catch (error) {
    // Handle errors during user deletion
    throw new Error(`Error deleting user: ${error.message}`);
  }
};
