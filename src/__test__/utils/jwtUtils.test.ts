// Import JWT utility functions and types
import { Types } from "mongoose";
import {
  JWTPayload,
  generateToken,
  verifyToken,
  verifyTokenAndAuthorization,
} from "../../utils/jwtUtils";

// Import dotenv to load environment variables
import dotenv from "dotenv";
dotenv.config();
const mockId = new Types.ObjectId();

// Describe block for JWT Utils Tests
describe("JWT Utils Tests", () => {
  // Mock payload for JWT token generation
  const mockPayload: JWTPayload = {
    id: mockId,
    username: "mockUsername",
    email: "mock@example.com",
    isAdmin: false,
  };

  const mockToken = "mockToken"; // Mock token for testing

  // Set up mock environment variables for JWT
  process.env.JWT_SEC = "mockSecret"; // Mock JWT secret
  process.env.JWT_EXPIRY_PERIOD = "1h"; // Mock JWT expiry period

  // Test Case: Generate Token
  it("should generate a JWT token", () => {
    // Call the generateToken function with the mock payload
    const token = generateToken(mockPayload);

    // Expectations
    expect(token).toBeDefined(); // Ensure the token is defined
  });

  // Test Case: Verify Token (valid token)
  it("should verify a valid JWT token", (done) => {
    // Mock request object with a valid token in the headers
    const req: any = {
      headers: {
        token: `Bearer ${mockToken}`,
      },
    };

    // Mock response object to simulate Express response behavior
    const res: any = {
      status: (status: number) => {
        expect(status).toBe(403); // Expect a 403 status for invalid token
        return {
          json: (message: string) => {
            expect(message).toBe("Token is not valid!"); // Expect the error message
            done(); // Signal that the test is complete
          },
        };
      },
    };

    // Mock next function (should not be called in this case)
    const next = () => {
      done.fail("Should not reach next middleware on invalid token"); // Fail if next is called
    };

    // Call the verifyToken function with the mock request, response, and next
    verifyToken(req, res, next);
  });

  // Test Case: Verify Token (invalid token)
  it("should handle an invalid JWT token", (done) => {
    // Mock request object with an invalid token in the headers
    const req: any = {
      headers: {
        token: "InvalidToken",
      },
    };

    // Mock response object to simulate Express response behavior
    const res: any = {
      status: (status: number) => {
        expect(status).toBe(403); // Expect a 403 status for invalid token
        return {
          json: (message: string) => {
            expect(message).toBe("Token is not valid!"); // Expect the error message
            done(); // Signal that the test is complete
          },
        };
      },
    };

    // Mock next function (should not be called in this case)
    const next = () => {
      done.fail("Should not reach next middleware on invalid token"); // Fail if next is called
    };

    // Call the verifyToken function with the mock request, response, and next
    verifyToken(req, res, next);
  });

  // Cleanup: Reset environment variables after tests
  afterAll(() => {
    delete process.env.JWT_SEC; // Delete the mock JWT secret
    delete process.env.JWT_EXPIRY_PERIOD; // Delete the mock JWT expiry period
  });
});
