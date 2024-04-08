const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: [true, "Product Name  must be provided!"],
    },
    productDescription: {
      type: String,
      required: [true, "Product Description  must be provided!"],
    },
    productPrice: {
      type: String,
      required: [true, "Product Price  must be provided!"],
    },
    productStockQuantity: {
      type: String,
      required: [true, "Product Stock Quantity  must be provided!"],
    },
    productStatus: {
      type: String,
      enum: ["available", "unabailable"],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;