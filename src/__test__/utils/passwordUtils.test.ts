// Import the passwordUtils module for password-related utilities
import * as passwordUtils from "../../utils/passwordUtils";

// Describe block for Password Utilities Tests
describe("Password Utilities Tests", () => {
  // Test Case: Hash Password
  it("Should hash Password", async () => {
    const password = "Testpassword"; // Define a sample password

    // Call the hashPassword function to hash the password
    const hashedPassword = await passwordUtils.hashPassword(password);

    // Expectations
    expect(hashedPassword).toBeDefined(); // Check if the hashed password is defined
    expect(typeof hashedPassword).toBe("string"); // Check if the hashed password is a string
  });

  // Test Case: Compare Valid Password
  it("should compare a valid password", async () => {
    const password = "testpassword"; // Define a sample password

    // Hash the password using the hashPassword function
    const hashedPassword = await passwordUtils.hashPassword(password);

    // Compare the original password with the hashed password
    const isPasswordValid = await passwordUtils.comparePassword(
      password,
      hashedPassword
    );

    // Expectations
    expect(isPasswordValid).toBe(true); // Check if the password comparison returns true (valid password)
  });

  // Test Case: Compare Invalid Password
  it("should compare an invalid password", async () => {
    const password = "testpassword"; // Define a sample password

    // Hash the password using the hashPassword function
    const hashedPassword = await passwordUtils.hashPassword(password);

    // Compare an incorrect password with the hashed password
    const isPasswordValid = await passwordUtils.comparePassword(
      "wrongpassword", // Incorrect password
      hashedPassword
    );

    // Expectations
    expect(isPasswordValid).toBe(false); // Check if the password comparison returns false (invalid password)
  });
});
