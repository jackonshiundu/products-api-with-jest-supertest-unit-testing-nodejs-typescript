import express from "express";
import userRoutes from "./User.routes";
import productRoutes from "./Products.routes";

const router = express.Router();

export default (): express.Router => {
  // USER
  userRoutes(router);

  //   PRODUCT
  productRoutes(router);
  return router;
};
