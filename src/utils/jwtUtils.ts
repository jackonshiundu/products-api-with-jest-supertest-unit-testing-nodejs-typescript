// Importing necessary modules
import { Types } from "mongoose"; // For MongoDB object ID manipulation
import jwt, { VerifyErrors } from "jsonwebtoken"; // For handling JSON Web Tokens
import { NextFunction, Request, Response } from "express"; // For Express middleware types

// Defining the payload structure for the JWT
type JWTPayload = {
  id: Types.ObjectId; // The user's MongoDB ID
  username: string; // The user's username
  email: string; // The user's email
  isAdmin: boolean; // Whether the user has admin privileges
};

// Custom request type extending Express's Request to include 'user' property
interface CustomRequest extends Request {
  user: {
    id: Types.ObjectId; // The user's MongoDB ID
    username: string; // The user's username
    email: string; // The user's email
    isAdmin: boolean; // Whether the user is an admin
  };
}

// Function to generate a JWT token for a given payload
export const generateToken = (payload: JWTPayload): string => {
  // Checking if the secret key exists in environment variables
  if (!process.env.JWT_SEC) {
    throw new Error("JWT_SEC environment variable is not defined");
  }

  // Generating the token using the secret key
  const token = jwt.sign(payload, process.env.JWT_SEC, {
    expiresIn: "1d",
  });
  return token;
};

// Middleware function to verify the JWT token from the request
export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  // Retrieving the token from the Authorization header
  const authHeader = req.headers.token;

  // If there's a token in the request header
  if (authHeader) {
    // Extracting the token from the "Bearer <token>" format
    const token = Array.isArray(authHeader)
      ? authHeader[0].split(" ")[1]
      : authHeader.split(" ")[1];

    // Checking if the secret key exists
    if (!process.env.JWT_SEC) {
      throw new Error("JWT_SEC environment variable is not defined");
    }

    // Verifying the token using the secret key
    jwt.verify(
      token,
      process.env.JWT_SEC,
      (err: VerifyErrors | null, user: any) => {
        if (err) return res.status(403).json("Token is not valid!"); // Token is invalid
        req.user = user; // Attaching user data to the request object
        next(); // Proceed to the next middleware
      }
    );
  } else {
    // If no token is found, return an authentication error
    res.status(401).json("You are not authenticated!");
  }
};

// Middleware to check if the user is authorized to access their own account
export const verifyTokenAndAuthorization = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  // First, verify the token
  verifyToken(req, res, () => {
    // If the user is trying to access their own data or is an admin, allow access
    if (req.user.id.toString() === req.params.id || req.user.isAdmin) {
      next(); // Proceed to the next middleware
    } else {
      // If the user is not authorized, return an error
      return res.status(403).json("You are not allowed to do that!");
    }
  });
};

// Middleware to check if the user has admin privileges
export const verifyTokenAndAdmin = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  // First, verify the token
  verifyToken(req, res, () => {
    // If the user is an admin, allow access
    if (req.user.isAdmin) {
      next(); // Proceed to the next middleware
    } else {
      // If the user is not an admin, return an error
      return res.status(403).json("You are not allowed to do that!");
    }
  });
};
