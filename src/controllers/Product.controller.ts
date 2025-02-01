import { Request, Response } from "express";
import * as ProductServices from "../services/productService";

// Create a new product
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Call the productService to create a new product with the provided data in the request body
    const newProduct = await ProductServices.createProduct(req.body);

    // Return a 201 status code and the created product as the response
    res.status(201).json(newProduct);
  } catch (error) {
    // Handle errors and return a 500 status with the error message
    res.status(500).json({ error: error.message });
  }
};

// Get all products
export const getAllProducts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    // Call the productService to get all products
    const products = await ProductServices.getAllProducts();

    // Return a 200 status code and the list of products as the response
    res.status(200).json(products);
  } catch (error) {
    // Handle errors and return a 500 status with the error message
    res.status(500).json({ error: error.message });
  }
};

// Get product by ID
export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get the product by ID from the request parameters
    const product = await ProductServices.getProductById(req.params.productId);

    // If the product is found, return it with a 200 status code
    if (product) {
      res.status(200).json(product);
    } else {
      // If the product is not found, return a 404 status with an error message
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    // Handle errors and return a 500 status with the error message
    res.status(500).json({ error: error.message });
  }
};

// Update product by ID
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Update the product using the ID from the request parameters and the data from the request body
    const updatedProduct = await ProductServices.updateProduct(
      req.params.productId,
      req.body
    );

    // If the product is found and updated, return it with a 200 status code
    if (updatedProduct) {
      res.status(200).json(updatedProduct);
    } else {
      // If the product is not found, return a 404 status with an error message
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    // Handle errors and return a 500 status with the error message
    res.status(500).json({ error: error.message });
  }
};

// Delete product by ID
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Delete the product using the ID from the request parameters
    await ProductServices.deleteProduct(req.params.productId);

    // Return a 204 status code to indicate successful deletion with no content
    res.status(204).send();
  } catch (error) {
    // Handle errors and return a 500 status with the error message
    res.status(500).json({ error: error.message });
  }
};
