// Importing necessary module for hashing passwords
import bcrypt from "bcrypt";

// Function to hash a plain text password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRound = 10; // Defining the number of salt rounds for bcrypt hashing
  // Hashing the password with bcrypt using the salt rounds
  const hashedPassword = await bcrypt.hash(password, saltRound);
  return hashedPassword; // Returning the hashed password
};

// Function to compare a plain text password with a hashed password
export const comparePassword = async (
  password: string, // The plain text password to compare
  hashedPassword: string // The hashed password to compare with
): Promise<boolean> => {
  // Using bcrypt's compare method to check if the plain text password matches the hashed password
  return bcrypt.compare(password, hashedPassword);
};
