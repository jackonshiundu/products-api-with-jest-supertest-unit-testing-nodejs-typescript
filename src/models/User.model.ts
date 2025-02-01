//importing neccessary modules
import mongoose, { Document, Schema, Types } from "mongoose";

//defining interface for the user model
//we are also extending mongoose document so that our user inteface is compatible with mangoose document type and also inherit all the document property and methods
export interface TheUser extends Document {
  email: string;
  username: string;
  password: string;
  isAdmin: boolean;
  savedProducts: Types.ObjectId[];
}

//Creating our user Schema

const userSchema: Schema<TheUser> = new Schema(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    savedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);
//Creating and exportign the user model.
export default mongoose.model<TheUser>("User", userSchema);
