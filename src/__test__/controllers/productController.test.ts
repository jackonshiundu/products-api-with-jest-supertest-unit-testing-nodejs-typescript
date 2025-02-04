import { Request, Response } from "express";
import * as ProductService from "../../services/productService";
import * as ProductController from "../../controllers/Product.controller";

// Mock the ProductService module to isolate the controller tests
jest.mock("../../services/productService");

// Describe block for the Product Controller test suite
describe("Product Controller test", () => {
  // Test Case: Create a new product successfully
  it("Should create a new Product", async () => {
    // Mock the request object with a body containing product data
    const mockRequest: Request<{}, any, any, any, Record<string, any>> = {
      body: {
        title: "Mocked Product",
        description: "A description for the mocked product",
        image: "mocked_image.jpg",
        category: "Mocked Category",
        quantity: "10",
        inStock: true,
      },
    } as Request<{}, any, any, any, Record<string, any>>;

    // Mock the response object with Jest functions for status, send, and json
    const mockResponse = {
      status: jest.fn().mockReturnThis(), // Allows chaining by returning the response object
      send: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the createProduct function of ProductService to return a resolved promise with mocked product data
    (ProductService.createProduct as jest.Mock).mockResolvedValueOnce({
      _id: "mockedProductId",
      title: "Mocked Product",
      description: "A description for the mocked product",
      image: "mocked_image.jpg",
      category: "Mocked Category",
      quantity: "10",
      inStock: true,
    });

    // Call the createProduct controller function with the mocked request and response
    await ProductController.createProduct(mockRequest, mockResponse);

    // Expectations:
    // 1. Ensure createProduct was called with the correct request body
    expect(ProductService.createProduct).toHaveBeenCalledWith(mockRequest.body);
    // 2. Ensure the response status was set to 201 (Created)
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    // 3. Ensure the response JSON contains the mocked product data
    expect(mockResponse.json).toHaveBeenCalledWith({
      _id: "mockedProductId",
      title: "Mocked Product",
      description: "A description for the mocked product",
      image: "mocked_image.jpg",
      category: "Mocked Category",
      quantity: "10",
      inStock: true,
    });
    // 4. Ensure the send method was not called (since json was used)
    expect(mockResponse.send).not.toHaveBeenCalled();
  });

  // Test Case: Get all products successfully
  it("Should get all products", async () => {
    // Mock the request object (no body or params needed for this endpoint)
    const mockRequest: any = {};
    // Mock the response object with Jest functions for status, send, and json
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the getAllProducts function of ProductService to return a resolved promise with mocked product data
    (ProductService.getAllProducts as jest.Mock).mockResolvedValueOnce([
      {
        _id: "mockedProductId1",
        title: "Mocked Product 1",
        description: "Description for mocked product 1",
        image: "image1.jpg",
        category: "Category 1",
        quantity: "5",
        inStock: true,
      },
      {
        _id: "mockedProductId2",
        title: "Mocked Product 2",
        description: "Description for mocked product 2",
        image: "image2.jpg",
        category: "Category 2",
        quantity: "10",
        inStock: false,
      },
    ]);

    // Call the getAllProducts controller function with the mocked request and response
    await ProductController.getAllProducts(mockRequest, mockResponse);

    // Expectations:
    // 1. Ensure getAllProducts was called
    expect(ProductService.getAllProducts).toHaveBeenCalled();
    // 2. Ensure the response status was set to 200 (OK)
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    // 3. Ensure the response JSON contains the mocked product data
    expect(mockResponse.json).toHaveBeenCalledWith([
      {
        _id: "mockedProductId1",
        title: "Mocked Product 1",
        description: "Description for mocked product 1",
        image: "image1.jpg",
        category: "Category 1",
        quantity: "5",
        inStock: true,
      },
      {
        _id: "mockedProductId2",
        title: "Mocked Product 2",
        description: "Description for mocked product 2",
        image: "image2.jpg",
        category: "Category 2",
        quantity: "10",
        inStock: false,
      },
    ]);
    // 4. Ensure the send method was not called (since json was used)
    expect(mockResponse.send).not.toHaveBeenCalled();
  });

  // Test Case: Handle errors when getting all products
  it("should handle errors when getting all products", async () => {
    // Mock the request object (no body or params needed for this endpoint)
    const mockRequest: any = {};
    // Mock the response object with Jest functions for status, send, and json
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the getAllProducts function of ProductService to throw an error
    (ProductService.getAllProducts as jest.Mock).mockRejectedValueOnce(
      new Error("Error getting products")
    );

    // Call the getAllProducts controller function with the mocked request and response
    await ProductController.getAllProducts(mockRequest, mockResponse);

    // Expectations:
    // 1. Ensure getAllProducts was called
    expect(ProductService.getAllProducts).toHaveBeenCalled();
    // 2. Ensure the response status was set to 500 (Internal Server Error)
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    // 3. Ensure the response JSON contains the error message
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Error getting products",
    });
    // 4. Ensure the send method was not called (since json was used)
    expect(mockResponse.send).not.toHaveBeenCalled();
  });

  // Test Case: Get product by ID successfully
  it("should get product by ID successfully", async () => {
    // Mock the request object with a productId parameter
    const mockRequest: Request = {
      params: { productId: "mockedProductId" },
    } as unknown as Request;

    // Mock the response object with Jest functions for status, send, and json
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the getProductById function of ProductService to return a resolved promise with mocked product data
    (ProductService.getProductById as jest.Mock).mockResolvedValueOnce({
      _id: "mockedProductId",
      title: "Mocked Product",
      description: "Description for mocked product",
      image: "mocked_image.jpg",
      category: "Mocked Category",
      quantity: "10",
      inStock: true,
    });

    // Call the getProductById controller function with the mocked request and response
    await ProductController.getProductById(mockRequest, mockResponse);

    // Expectations:
    // 1. Ensure getProductById was called with the correct productId
    expect(ProductService.getProductById).toHaveBeenCalledWith(
      "mockedProductId"
    );
    // 2. Ensure the response status was set to 200 (OK)
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    // 3. Ensure the response JSON contains the mocked product data
    expect(mockResponse.json).toHaveBeenCalledWith({
      _id: "mockedProductId",
      title: "Mocked Product",
      description: "Description for mocked product",
      image: "mocked_image.jpg",
      category: "Mocked Category",
      quantity: "10",
      inStock: true,
    });
    // 4. Ensure the send method was not called (since json was used)
    expect(mockResponse.send).not.toHaveBeenCalled();
  });

  // Test Case: Handle product not found when getting by ID
  it("should handle product not found when getting by ID", async () => {
    // Mock the request object with a non-existent productId parameter
    const mockRequest: Request = {
      params: { productId: "nonExistentProductId" },
    } as unknown as Request;

    // Mock the response object with Jest functions for status, send, and json
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the getProductById function of ProductService to return null (product not found)
    (ProductService.getProductById as jest.Mock).mockResolvedValueOnce(null);

    // Call the getProductById controller function with the mocked request and response
    await ProductController.getProductById(mockRequest, mockResponse);

    // Expectations:
    // 1. Ensure getProductById was called with the correct productId
    expect(ProductService.getProductById).toHaveBeenCalledWith(
      "nonExistentProductId"
    );
    // 2. Ensure the response status was set to 404 (Not Found)
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    // 3. Ensure the response JSON contains the error message
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Product not found",
    });
    // 4. Ensure the send method was not called (since json was used)
    expect(mockResponse.send).not.toHaveBeenCalled();
  });

  // Test Case: Handle errors when getting product by ID
  it("should handle errors when getting product by ID", async () => {
    // Mock the request object with a productId parameter
    const mockRequest: Request = {
      params: { productId: "mockedProductId" },
    } as unknown as Request;

    // Mock the response object with Jest functions for status, send, and json
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the getProductById function of ProductService to throw an error
    (ProductService.getProductById as jest.Mock).mockRejectedValueOnce(
      new Error("Error getting product by ID")
    );

    // Call the getProductById controller function with the mocked request and response
    await ProductController.getProductById(mockRequest, mockResponse);

    // Expectations:
    // 1. Ensure getProductById was called with the correct productId
    expect(ProductService.getProductById).toHaveBeenCalledWith(
      "mockedProductId"
    );
    // 2. Ensure the response status was set to 500 (Internal Server Error)
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    // 3. Ensure the response JSON contains the error message
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Error getting product by ID",
    });
    // 4. Ensure the send method was not called (since json was used)
    expect(mockResponse.send).not.toHaveBeenCalled();
  });

  // Test Case: Update product by ID successfully
  it("should update product by ID successfully", async () => {
    // Mock the request object with a productId parameter and updated product data in the body
    const mockRequest: Request = {
      params: { productId: "mockedProductId" },
      body: {
        title: "Updated Product",
        description: "Updated description",
        image: "updated_image.jpg",
        category: "Updated Category",
        quantity: "15",
        inStock: false,
      },
    } as unknown as Request;

    // Mock the response object with Jest functions for status, send, and json
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the updateProduct function of ProductService to return a resolved promise with updated product data
    (ProductService.updateProduct as jest.Mock).mockResolvedValueOnce({
      _id: "mockedProductId",
      title: "Updated Product",
      description: "Updated description",
      image: "updated_image.jpg",
      category: "Updated Category",
      quantity: "15",
      inStock: false,
    });

    // Call the updateProduct controller function with the mocked request and response
    await ProductController.updateProduct(mockRequest, mockResponse);

    // Expectations:
    // 1. Ensure updateProduct was called with the correct productId and updated data
    expect(ProductService.updateProduct).toHaveBeenCalledWith(
      "mockedProductId",
      mockRequest.body
    );
    // 2. Ensure the response status was set to 200 (OK)
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    // 3. Ensure the response JSON contains the updated product data
    expect(mockResponse.json).toHaveBeenCalledWith({
      _id: "mockedProductId",
      title: "Updated Product",
      description: "Updated description",
      image: "updated_image.jpg",
      category: "Updated Category",
      quantity: "15",
      inStock: false,
    });
    // 4. Ensure the send method was not called (since json was used)
    expect(mockResponse.send).not.toHaveBeenCalled();
  });

  // Test Case: Handle product not found when updating by ID
  it("should handle product not found when updating by ID", async () => {
    // Mock the request object with a non-existent productId parameter and updated product data in the body
    const mockRequest: Request = {
      params: { productId: "nonExistentProductId" },
      body: {
        title: "Updated Product",
        description: "Updated description",
        image: "updated_image.jpg",
        category: "Updated Category",
        quantity: "15",
        inStock: false,
      },
    } as unknown as Request;

    // Mock the response object with Jest functions for status, send, and json
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the updateProduct function of ProductService to return null (product not found)
    (ProductService.updateProduct as jest.Mock).mockResolvedValueOnce(null);

    // Call the updateProduct controller function with the mocked request and response
    await ProductController.updateProduct(mockRequest, mockResponse);

    // Expectations:
    // 1. Ensure updateProduct was called with the correct productId and updated data
    expect(ProductService.updateProduct).toHaveBeenCalledWith(
      "nonExistentProductId",
      mockRequest.body
    );
    // 2. Ensure the response status was set to 404 (Not Found)
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    // 3. Ensure the response JSON contains the error message
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Product not found",
    });
    // 4. Ensure the send method was not called (since json was used)
    expect(mockResponse.send).not.toHaveBeenCalled();
  });

  // Test Case: Handle errors when updating product by ID
  it("should handle errors when updating product by ID", async () => {
    // Mock the request object with a productId parameter and updated product data in the body
    const mockRequest: Request = {
      params: { productId: "mockedProductId" },
      body: {
        title: "Updated Product",
        description: "Updated description",
        image: "updated_image.jpg",
        category: "Updated Category",
        quantity: "15",
        inStock: false,
      },
    } as unknown as Request;

    // Mock the response object with Jest functions for status, send, and json
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the updateProduct function of ProductService to throw an error
    (ProductService.updateProduct as jest.Mock).mockRejectedValueOnce(
      new Error("Error updating product by ID")
    );

    // Call the updateProduct controller function with the mocked request and response
    await ProductController.updateProduct(mockRequest, mockResponse);

    // Expectations:
    // 1. Ensure updateProduct was called with the correct productId and updated data
    expect(ProductService.updateProduct).toHaveBeenCalledWith(
      "mockedProductId",
      mockRequest.body
    );
    // 2. Ensure the response status was set to 500 (Internal Server Error)
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    // 3. Ensure the response JSON contains the error message
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Error updating product by ID",
    });
    // 4. Ensure the send method was not called (since json was used)
    expect(mockResponse.send).not.toHaveBeenCalled();
  });

  // Test Case: Delete product by ID - Success
  it("should delete product by ID successfully", async () => {
    // Mock the request and response objects
    const mockRequest: Request = {
      params: { productId: "mockedProductId" },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    // Call the deleteProduct function of the ProductService
    await ProductController.deleteProduct(mockRequest, mockResponse);

    // Expectations
    expect(ProductService.deleteProduct).toHaveBeenCalledWith(
      "mockedProductId"
    );
    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.send).toHaveBeenCalled();
  });

  // Test Case: Delete product by ID - Not Found
  it("should handle product not found when deleting by ID", async () => {
    // Mock the request and response objects
    const mockRequest: Request = {
      params: { productId: "nonExistentProductId" },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the deleteProduct function of the ProductService to return null
    (ProductService.deleteProduct as jest.Mock).mockResolvedValueOnce(null);

    // Call the deleteProduct controller
    await ProductController.deleteProduct(mockRequest, mockResponse);

    // Expectations
    expect(ProductService.deleteProduct).toHaveBeenCalledWith(
      "nonExistentProductId"
    );
    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.send).toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled(); // Ensure json is not called for a 204 status
  });

  // Test Case: Delete product by ID - Error
  it("should handle errors when deleting product by ID", async () => {
    // Mock the request and response objects
    const mockRequest: Request = {
      params: { productId: "mockedProductId" },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the deleteProduct function of the ProductService to throw an error
    (ProductService.deleteProduct as jest.Mock).mockRejectedValueOnce(
      new Error("Error deleting product by ID")
    );

    // Call the deleteProduct controller
    await ProductController.deleteProduct(mockRequest, mockResponse);

    // Expectations
    expect(ProductService.deleteProduct).toHaveBeenCalledWith(
      "mockedProductId"
    );
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Error deleting product by ID",
    });
    expect(mockResponse.send).not.toHaveBeenCalled(); // Ensure send is not called for a 500 status
  });
});
