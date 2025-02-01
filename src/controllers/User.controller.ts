import { Request, Response } from "express";
import * as UserServices from "../services/userService";

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    // Call the createUser service to create a new user with the request body data
    const newUser = await UserServices.createUSer(req.body);

    // Respond with the newly created user and a 201 status code
    res.status(201).json(newUser);
  } catch (error) {
    // Handle errors and respond with a 500 status code and the error message
    res.status(500).json({ error: error.message });
  }
};

// Login user - Check credentials and generate token
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Attempt to login and get the user and JWT token from the service
    const { user, token } = await UserServices.loginUser(email, password);

    // If successful, respond with user data and token, and a 200 status code
    res.status(200).json({ user, token });
  } catch (error) {
    // If login fails, respond with a 401 status code (Unauthorized) and the error message
    res.status(401).json({ error: error.message });
  }
};

// Get all users
export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch all users using the userService
    const users = await UserServices.getAllUsers();

    // Return the list of users with a 200 status code
    res.status(200).json(users);
  } catch (error) {
    // Handle errors and return a 500 status code with the error message
    res.status(500).json({ error: error.message });
  }
};

// Get a user by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch the user using their ID from the request parameters
    const user = await UserServices.getUserById(req.params.userId);

    // If the user is found, return the user with a 200 status code
    if (user) {
      res.status(200).json(user);
    } else {
      // If the user is not found, return a 404 status with an error message
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    // Handle errors and return a 500 status code with the error message
    res.status(500).json({ error: error.message });
  }
};

// Update a user by ID
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Update the user by their ID, passing in the updated user data from the request body
    const updatedUser = await UserServices.updateUser(
      req.params.userId,
      req.body
    );

    // If the user is found and updated, return the updated user data
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      // If the user is not found, return a 404 status with an error message
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    // Handle errors and return a 500 status code with the error message
    res.status(500).json({ error: error.message });
  }
};

// Delete a user by ID
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Delete the user by their ID from the request parameters
    await UserServices.deleteUser(req.params.userId);

    // Return a 204 status code indicating successful deletion with no content
    res.status(204).send();
  } catch (error) {
    // Handle errors and return a 500 status code with the error message
    res.status(500).json({ error: error.message });
  }
};
