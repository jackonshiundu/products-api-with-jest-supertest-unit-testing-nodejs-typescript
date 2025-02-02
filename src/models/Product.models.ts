// Import necessary modules
import mongoose, { Schema } from "mongoose";
// Define the interface for Product document

export interface TheProduct extends Document {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  quantity: string;
  inStock: boolean;
}

//creaing the product schema
const productSchema: Schema<TheProduct> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: String, required: true },
    inStock: { type: Boolean, default: false },
  },
  { timestamps: true }
);
// Create and export the Product model
export default mongoose.model<TheProduct>("Product", productSchema);
