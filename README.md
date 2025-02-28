# Products API with Unit Testing
This project is a Node.js and TypeScript based RESTful API for managing products. It allows clients to interact with a database to perform CRUD (Create, Retrieve, Update, Delete) operations on products. The API is secured using JWT (JSON Web Token) authentication to ensure only authorized users can access or manipulate data.

The project also includes unit testing using Jest and Supertest to ensure the reliability and correctness of the codebase.

Table of Contents
Features

Project Structure

Technologies Used

Setup and Installation

Running the API

Running Tests

Contributing

License

# Features
CRUD Operations: Create, Retrieve, Update, and Delete products.

JWT Authentication: Secure API endpoints with token-based authentication.

Unit Testing: Comprehensive unit tests for models, services, controllers, and routes using Jest and Supertest.

TypeScript: Strongly-typed codebase for better maintainability and scalability.

Modular Structure: Organized into models, services, controllers, routes, and utility functions.

# Project Structure
The project is structured as follows:
```
products-api/
├── __tests__/                  # Unit tests for all components
│   ├── controllers/            # Tests for controllers
|   ├── routes/                 # Tests for routes
│   ├── services/               # Tests for services
│   ├── utils/                  # Tests for utility functions
│   ├── app.test.ts             # Test for the main app
├── src/
│   ├── models/                 # Database models (e.g., Product model)
│   ├── services/               # Business logic (e.g., ProductService)
│   ├── controllers/            # Request handlers (e.g., ProductController)
│   ├── routes/                 # API routes (e.g., productRoutes)
│   ├── utils/                  # Utility functions (e.g., JWT token generation)
│   ├── app.ts                  # Main application setup
│   ├── server.ts               # Server entry point
├── .env                        # Environment variables
├── .gitignore                  # Files and folders to ignore in Git
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── README.md                   # Project documentation
```
# Technologies Used
Node.js: Runtime environment for the API.

TypeScript: Adds static typing to JavaScript.

Express.js: Web framework for building the API.

JWT (JSON Web Tokens): For authentication and authorization.

Jest: JavaScript testing framework.

Supertest: Library for testing HTTP endpoints.

MongoDB: Database for storing product data.

Mongoose: MongoDB object modeling for Node.js.

Dotenv: For managing environment variables.

# Setup and Installation
1.Clone the Repository:
```
https://github.com/jackonshiundu/products-api-with-jest-supertest-unit-testing-nodejs-typescript.git
```
2.Install Dependencies:
```
npm install
```
3.Set Up Environment Variables:
Create a .env file in the root directory and add the following variables:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/products_db
JWT_SECRET=your_jwt_secret_key
```
# Running the API
To start the API in development mode:
npm run dev
To build and run the API in production mode:
npm run build
npm start
# Running Tests
To run all unit tests:
npm test
# Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.

Create a new branch for your feature or bugfix.

Commit your changes and push to the branch.

Submit a pull request.
