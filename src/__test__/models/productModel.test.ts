import dotenv from "dotenv";
import Product, { TheProduct } from "../../models/Product.models";
import mongoose from "mongoose";

dotenv.config();

describe("Should test Product MOdel", () => {
  let createdProduct: TheProduct;

  beforeAll(async () => {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGO_URI environment variable is not defined/set");
    }
    await mongoose.connect(process.env.MONGODB_URL);
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("Create a product", async () => {
    const productData: Partial<TheProduct> = {
      title: "Test Product",
      description: "Product description",
      image: "https://testimage.png",
      category: "test category",
      quantity: "20 kgs",
    };

    createdProduct = await Product.create(productData);
    expect(createdProduct.title).toBe(productData.title);
    expect(createdProduct.description).toBe(productData.description);
    // Add other expectations for additional fields
  }, 10000);
  it("should fail to create a product with missing required fields", async () => {
    const productData: Partial<TheProduct> = {
      // Omitting required fields
    };
    try {
      // Attempt to create a product with missing required fields
      await Product.create(productData);
      // If the above line doesn't throw an error, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      // Expect a MongoDB validation error
      expect(error.name).toBe("ValidationError");
    }
  }, 10000);
  // Test Case: Get all products
  it("should get all products", async () => {
    // Fetch all products from the database
    const allProducts = await Product.find();

    // Expectations
    const productWithoutTimestamps = {
      //   _id: createdProduct._id,
      title: createdProduct.title,
      description: createdProduct.description,
      // Add other necessary fields
    };

    expect(allProducts).toContainEqual(
      expect.objectContaining(productWithoutTimestamps)
    );
  });
  const removeMongoProps = (product: any) => {
    const { __v, _id, createdAt, updatedAt, ...cleanedProduct } =
      product.toObject();
    return cleanedProduct;
  };

  // Test Case: Get all products
  it("should get all products", async () => {
    const allProducts = await Product.find();

    // If there is a created product, expect the array to contain an object
    // that partially matches the properties of the createdProduct
    if (createdProduct) {
      const cleanedCreatedProduct = removeMongoProps(createdProduct);

      expect(allProducts).toEqual(
        expect.arrayContaining([expect.objectContaining(cleanedCreatedProduct)])
      );
    }
  });

  // Test Case: Update an existing product
  it("should update an existing product", async () => {
    // Check if there is a created product to update
    if (createdProduct) {
      // Define updated data
      const updatedProductData: Partial<TheProduct> = {
        title: "Test Product", // replace hre with your updated title
        // Update other necessary fields
      };

      // Update the product and get the updated product
      const updatedProduct = await Product.findByIdAndUpdate(
        createdProduct._id,
        updatedProductData,
        { new: true }
      );

      // Expectations
      expect(updatedProduct?.title).toBe(updatedProductData.title);
      // Add expectations for other updated fields
    }
  });

  // Test Case: Get product by ID
  it("should get product by ID", async () => {
    // Get the created product by ID
    const retrievedProduct = await Product.findById(createdProduct._id);

    // Expectations
    expect(retrievedProduct?.title).toBe(createdProduct.title);
    // Add other expectations for properties you want to compare
  });

  // Test Case: Delete an existing product
  it("should delete an existing product", async () => {
    // Delete the created product
    await Product.findByIdAndDelete(createdProduct._id);

    // Attempt to find the deleted product
    const deletedProduct = await Product.findById(createdProduct._id);

    // Expectations
    expect(deletedProduct).toBeNull();
  });
});
