const Product = require("../../../model/productModel");

exports.createProduct = async (req, res) => {
  const {
    productName,
    productDescription,
    productPrice,
    productStockQuantity,
    productStatus,
  } = req.body;

  if (
    !productName ||
    !productDescription ||
    !productPrice ||
    !productStockQuantity ||
    !productStatus
  ) {
    return res.status(400).json({
      message: "Please fillup all the fields!",
    });
  }

  //   creating the product collection/table
  await Product.create({
    // since we are using the same variable names
    productName,
    productDescription,
    productPrice,
    productStockQuantity,
    productStatus,
  });
  res.status(201).json({
    message: "Product created succesfully!",
  });
};
