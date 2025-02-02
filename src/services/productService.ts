import Product, { TheProduct } from "../models/Product.models";

// Create a new product with the provided input
export const createProduct = async (
  productsInput: TheProduct
): Promise<TheProduct> => {
  try {
    // Create a new product in the database using the provided input
    const newProduct = await Product.create(productsInput);

    // Return the newly created product
    return newProduct;
  } catch (error) {
    // Handle errors during product creation
    throw new Error(`Error creating product: ${error.message}`);
  }
};

// Retrieve all products from the database
export const getAllProducts = async (): Promise<TheProduct[]> => {
  try {
    // Fetch all products from the database
    const products = await Product.find();

    // Return the list of products
    return products;
  } catch (error) {
    // Handle errors during fetching products
    throw new Error(`Error getting products: ${error.message}`);
  }
};

// Retrieve a product by its ID
export const getProductById = async (
  productId: string
): Promise<TheProduct | null> => {
  try {
    // Find the product by its ID
    const product = await Product.findById(productId);

    // Return the found product (or null if not found)
    return product;
  } catch (error) {
    // Handle errors during fetching the product
    throw new Error(`Error getting product: ${error.message}`);
  }
};

// Update a product's details by its ID
export const updateProduct = async (
  productId: string,
  updatedProduct: Partial<TheProduct>
): Promise<TheProduct | null> => {
  try {
    // Find the product by its ID and update its details
    const product = await Product.findByIdAndUpdate(productId, updatedProduct, {
      new: true, // Return the updated product
    });

    // Return the updated product
    return product;
  } catch (error) {
    // Handle errors during product update
    throw new Error(`Error updating product: ${error.message}`);
  }
};

// Delete a product by its ID
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    // Find the product by its ID and delete it
    await Product.findByIdAndDelete(productId);
  } catch (error) {
    // Handle errors during product deletion
    throw new Error(`Error deleting product: ${error.message}`);
  }
};
