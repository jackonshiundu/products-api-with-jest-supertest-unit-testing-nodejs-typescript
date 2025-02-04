import { TheUser } from "models/User.model";
import * as UserService from "../../services/userService";
import { Request, Response } from "express";
import * as UserController from "../../controllers/User.controller";
jest.mock("../../services/userService");

describe("User Controller Tests", () => {
  // Test Case: Create a new user
  it("should create a new user", async () => {
    // Mock user data that will be used as the request body
    const mockUserData: TheUser = {
      email: "test@example.com",
      username: "testuser",
      password: "testpassword",
      isAdmin: false,
      savedProducts: [],
    } as TheUser;

    // Mock the response that will be returned when the user is created
    const mockCreatedUser = {
      _id: "mockUserId",
      ...mockUserData,
    };

    // Mock the request object containing the user data
    const mockRequest = {
      body: mockUserData,
    } as Request;

    // Mock the response object methods (status, json)
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the UserService.createUser method to return the mockCreatedUser
    (UserService.createUser as jest.Mock).mockResolvedValueOnce(
      mockCreatedUser
    );

    // Call the createUser controller
    await UserController.createUser(mockRequest, mockResponse);

    // Expectations: Check if createUser was called with the correct data and if the response was as expected
    expect(UserService.createUser).toHaveBeenCalledWith(mockUserData);
    expect(mockResponse.status).toHaveBeenCalledWith(201); // Status 201 for created
    expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedUser);
  }, 20000);

  // Test Case: Login user
  it("should login a user and return a token", async () => {
    // Mock user credentials from the request body
    const mockUserCredentials = {
      email: "test@example.com",
      password: "testpassword",
    };

    // Define the expected response from login (user data + token)
    type TheMockCreatedUser = {
      user: Partial<TheUser>;
      token: string;
    };
    const mockLoginResponse: TheMockCreatedUser = {
      user: {
        _id: "mockUserId",
        email: mockUserCredentials.email,
        username: "testuser",
        isAdmin: false,
        savedProducts: [],
      },
      token: "mocked_token",
    };

    // Mock the request and response objects
    const mockRequest = {
      body: mockUserCredentials,
    } as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the loginUser function from UserService
    (UserService.loginUser as jest.Mock).mockResolvedValueOnce(
      mockLoginResponse
    );

    // Call the loginUser controller
    await UserController.loginUser(mockRequest, mockResponse);

    // Expectations: Check if loginUser was called with the correct credentials and the response is correct
    expect(UserService.loginUser).toHaveBeenCalledWith(
      mockUserCredentials.email,
      mockUserCredentials.password
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200); // Status 200 for success
    expect(mockResponse.json).toHaveBeenCalledWith(mockLoginResponse);
  }, 20000);

  // Test Case: Get all users
  it("should get all users", async () => {
    // Mock the list of users returned by the UserService
    const mockUsers: TheUser[] = [
      {
        _id: "mockUserId1",
        email: "user1@example.com",
        username: "user1",
        isAdmin: false,
        savedProducts: [],
      },
      {
        _id: "mockUserId2",
        email: "user2@example.com",
        username: "user2",
        isAdmin: true,
        savedProducts: [],
      },
    ] as TheUser[];

    // Mock the request and response objects
    const mockRequest = {} as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the getAllUsers function of the UserService
    (UserService.getAllUsers as jest.Mock).mockResolvedValueOnce(mockUsers);

    // Call the getAllUsers controller
    await UserController.getAllUsers(mockRequest, mockResponse);

    // Expectations: Check if getAllUsers was called and if the response is correct
    expect(UserService.getAllUsers).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200); // Status 200 for success
    expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
  }, 20000);

  // Test Case: Handle error fetching users
  it("should handle error when fetching users", async () => {
    // Mock an error response from the UserService
    const mockErrorResponse = {
      message: "Error fetching users",
    };

    // Mock the request and response objects
    const mockRequest = {} as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the getAllUsers function of the UserService to throw an error
    (UserService.getAllUsers as jest.Mock).mockRejectedValueOnce(
      mockErrorResponse
    );

    // Call the getAllUsers controller
    await UserController.getAllUsers(mockRequest, mockResponse);

    // Expectations: Check if getAllUsers was called and the error is handled properly
    expect(UserService.getAllUsers).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500); // Status 500 for server error
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: mockErrorResponse.message,
    });
  }, 20000);

  // Test Case: Get user by ID
  it("should get user by ID", async () => {
    // Mock a user that is returned from the UserService
    const mockUser: TheUser = {
      _id: "mockUserId",
      email: "mock@example.com",
      username: "mockUser",
      isAdmin: false,
      savedProducts: [],
    } as TheUser;

    // Mock the request and response objects, with the userId in the request params
    const mockRequest: any = {
      params: {
        userId: "mockUserId",
      },
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the getUserById function of the UserService
    (UserService.getUserById as jest.Mock).mockResolvedValueOnce(mockUser);

    // Call the getUserById controller
    await UserController.getUserById(mockRequest, mockResponse);

    // Expectations: Check if getUserById was called with the correct userId
    expect(UserService.getUserById).toHaveBeenCalledWith(
      mockRequest.params.userId
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200); // Status 200 for success
    expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
  }, 20000);

  // Test Case: User not found
  it("should handle case where user is not found", async () => {
    // Mock the request and response objects with a nonexistent userId
    const mockRequest: any = {
      params: {
        userId: "nonexistentUserId",
      },
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the getUserById function of the UserService to return null (user not found)
    (UserService.getUserById as jest.Mock).mockResolvedValueOnce(null);

    // Call the getUserById controller
    await UserController.getUserById(mockRequest, mockResponse);

    // Expectations: Check if the correct error is returned when the user is not found
    expect(UserService.getUserById).toHaveBeenCalledWith(
      mockRequest.params.userId
    );
    expect(mockResponse.status).toHaveBeenCalledWith(404); // Status 404 for not found
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "User not found" });
  }, 20000);

  // Test Case: Handle error when fetching user by ID
  it("should handle error when fetching user by ID", async () => {
    // Mock an error response from the UserService
    const mockErrorResponse = {
      message: "Error fetching user",
    };

    // Mock the request and response objects with a userId that triggers an error
    const mockRequest: any = {
      params: {
        userId: "errorUserId",
      },
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the getUserById function of the UserService to throw an error
    (UserService.getUserById as jest.Mock).mockRejectedValueOnce(
      mockErrorResponse
    );

    // Call the getUserById controller
    await UserController.getUserById(mockRequest, mockResponse);

    // Expectations: Check if the correct error is handled when fetching user
    expect(UserService.getUserById).toHaveBeenCalledWith(
      mockRequest.params.userId
    );
    expect(mockResponse.status).toHaveBeenCalledWith(500); // Status 500 for server error
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: mockErrorResponse.message,
    });
  }, 20000);

  // Test Case: Delete user by ID
  it("should delete user by ID", async () => {
    // Mock the request object with a userId to delete
    const mockRequest: Request<
      { userId: string },
      any,
      any,
      any,
      Record<string, any>
    > = {
      params: {
        userId: "mockUserId",
      },
    } as Request<{ userId: string }, any, any, any, Record<string, any>>;

    // Mock the response object methods (status, send, json)
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the deleteUser function of the UserService
    (UserService.deleteUser as jest.Mock).mockResolvedValueOnce(null);

    // Call the deleteUser controller
    await UserController.deleteUser(mockRequest, mockResponse);

    // Expectations: Check if deleteUser was called with the correct userId
    expect(UserService.deleteUser).toHaveBeenCalledWith(
      mockRequest.params.userId
    );
    expect(mockResponse.status).toHaveBeenCalledWith(204); // Status 204 for no content (successful deletion)
    expect(mockResponse.send).toHaveBeenCalled(); // Ensure that send method was called
    expect(mockResponse.json).not.toHaveBeenCalled(); // Ensure json is not called for a 204 status
  }, 20000);
});
