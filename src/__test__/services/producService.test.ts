// Import necessary modules and models
import mongoose from "mongoose"; // Import mongoose for MongoDB connection
import Product, { TheProduct } from "../../models/Product.models"; // Import Product model and TheProduct type
import dotenv from "dotenv"; // Import dotenv to load environment variables
import * as productService from "../../services/productService"; // Import productService for product-related operations

// Load environment variables from .env file
dotenv.config();

// Mock the Product model
jest.mock("../../models/Product.models", () => ({
  __esModule: true,
  default: {
    create: jest.fn(), // Mock the create method
    find: jest.fn(), // Mock the find method
    findById: jest.fn(), // Mock the findById method
    findByIdAndUpdate: jest.fn(), // Mock the findByIdAndUpdate method
    findByIdAndDelete: jest.fn(), // Mock the findByIdAndDelete method
  },
}));

// Mock product data for testing
const productId = "mockedProductId";
const mockProduct: TheProduct = {
  _id: productId,
  title: "Mocked Product",
  description: "A description for the mocked product",
  image: "mocked_image.jpg",
  category: "Mocked Category",
  quantity: "10",
  inStock: true,
} as TheProduct;

// Use the toObject method to include additional properties
const mockProductWithMethods = {
  ...mockProduct,
  toObject: jest.fn(() => mockProduct), // Mock the toObject method
};

// Mock the product retrieval by ID
(Product.findById as jest.Mock).mockResolvedValueOnce(mockProductWithMethods);

// Describe block for Product Service Tests
describe("Product Service Test", () => {
  // Set up MongoDB connection before running tests
  beforeAll(async () => {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGO_URI environment variable is not defined/set");
    }
    await mongoose.connect(process.env.MONGODB_URL); // Connect to MongoDB
  });

  // Clean up after tests
  afterAll(async () => {
    await mongoose.connection.close(); // Close the MongoDB connection
    jest.clearAllMocks(); // Clear all Jest mocks
  });

  // Test Case: Create a new product
  it("should create a new product", async () => {
    // Mock product data
    const productData: Partial<TheProduct> = {
      title: "Test Product",
      inStock: false,
      // Add other product properties based on your schema
    };

    // Mock the product creation
    (Product.create as jest.Mock).mockResolvedValueOnce({
      ...productData,
      _id: "mockedProductId", // Mocked product ID
    });

    // Call the createProduct function from productService
    const createdProduct = await productService.createProduct(
      productData as TheProduct
    );

    // Expectations
    expect(createdProduct.title).toBe(productData.title); // Check if the title matches
    expect(createdProduct.inStock).toBe(productData.inStock); // Check if the inStock flag matches
    // Add more expectations based on your schema and business logic
  }, 20000); // Timeout for the test set to 20 seconds

  // Test Case: Fetch a product by ID
  it("Should Fetch Product with the ID", async () => {
    // Mock product data
    const productId = "mockedProductId";
    const mockProduct: TheProduct = {
      _id: productId,
      title: "Mocked Product",
      description: "A description for the mocked product",
      image: "mocked_image.jpg",
      category: "Mocked Category",
      quantity: "10",
      inStock: true,
    } as TheProduct;

    // Use the toObject method to include additional properties
    const mockProductWithMethods = {
      ...mockProduct,
      toObject: jest.fn(() => mockProduct), // Mock the toObject method
    };

    // Mock the findById method of the Product model
    (Product.findById as jest.Mock).mockResolvedValueOnce(
      mockProductWithMethods
    );

    // Call the findById method
    const fetchedProduct = await Product.findById(productId);

    // Expectations
    expect(fetchedProduct).toEqual(
      expect.objectContaining({
        _id: mockProduct._id,
        title: mockProduct.title,
        description: mockProduct.description,
        image: mockProduct.image,
        category: mockProduct.category,
        quantity: mockProduct.quantity,
        inStock: mockProduct.inStock,
      })
    ); // Check if the fetched product matches the mock product
    expect(Product.findById).toHaveBeenCalledWith(productId); // Check if findById was called with the correct ID
  }, 20000); // Timeout for the test set to 20 seconds

  // Test Case: Update a product
  it("Should update Products", async () => {
    const productId = "mockedProduct";
    const mockProduct: TheProduct = {
      _id: productId,
      title: "Mocked Product",
      description: "A description for the mocked product",
      image: "mocked_image.jpg",
      category: "Mocked Category",
      quantity: "10",
      inStock: true,
    } as TheProduct;

    // Mock the findByIdAndUpdate method of the Product model
    (Product.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(mockProduct);

    // Mock updated product data
    const updatedProductData: Partial<TheProduct> = {
      title: "Mocked Product", // Update some fields
      quantity: "10",
    };

    // Call the updateProduct function from productService
    const updatedProduct = await productService.updateProduct(
      productId,
      updatedProductData
    );

    // Expectations
    expect(updatedProduct?._id).toBe(mockProduct._id); // Check if the ID matches
    expect(updatedProduct?.title).toBe(updatedProductData.title); // Check if the title matches
    expect(updatedProduct?.quantity).toBe(updatedProductData.quantity); // Check if the quantity matches
    // Add similar expectations for other properties

    // Check if findByIdAndUpdate was called with the correct arguments
    expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
      productId,
      updatedProductData,
      { new: true }
    );
  });

  // Test Case: Delete a product by ID
  it("Should Delete a Product by ID", async () => {
    const productId = "mockedProductID";
    const mockProduct: TheProduct = {
      _id: productId,
      title: "Mocked Product",
      description: "A description for the mocked product",
      image: "mocked_image.jpg",
      category: "Mocked Category",
      quantity: "10",
      inStock: true,
    } as TheProduct;

    // Mock the findByIdAndDelete method of the Product model
    (Product.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(mockProduct);

    // Call the findByIdAndDelete method
    await Product.findByIdAndDelete(productId);

    // Verify that findByIdAndDelete was called with the correct productId
    expect(Product.findByIdAndDelete).toHaveBeenCalledWith(productId);
  });

  // Test Case: Get all products
  it("should get all products", async () => {
    // Mock product data
    const mockProducts: TheProduct[] = [
      {
        _id: "product1",
        title: "Product 1",
        description: "Description for Product 1",
        image: "product1_image.jpg",
        category: "Category 1",
        quantity: "5",
        inStock: true,
      },
      {
        _id: "product2",
        title: "Product 2",
        description: "Description for Product 2",
        image: "product2_image.jpg",
        category: "Category 2",
        quantity: "10",
        inStock: false,
      },
    ] as TheProduct[];

    // Mock the find method of the Product model
    (Product.find as jest.Mock).mockResolvedValueOnce(mockProducts);

    // Call the getAllProducts function from productService
    const retrievedProducts = await productService.getAllProducts();

    // Expectations
    expect(Product.find).toHaveBeenCalled(); // Check if find was called
    expect(retrievedProducts).toEqual(mockProducts); // Check if the retrieved products match the mock data
  }, 20000); // Timeout for the test set to 20 seconds
});
