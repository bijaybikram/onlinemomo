const Product = require("../../../model/productModel");

exports.createProduct = async (req, res) => {
  console.log(req.file);
  const file = req.file;
  let filePath;
  if (!file) {
    filePath =
      "https://blog-images-1.pharmeasy.in/blog/production/wp-content/uploads/2021/05/18144539/shutterstock_1772959055-1.jpg";
  } else {
    filePath = req.file.filename;
  }
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
    productImage: process.env.PROJECT_URL + filePath,
    productPrice,
    productStockQuantity,
    productStatus,
  });
  res.status(201).json({
    message: "Product created succesfully!",
  });
};
