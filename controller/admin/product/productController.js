const Product = require("../../../model/productModel");
const fs = require("fs");

exports.createProduct = async (req, res) => {
  console.log(req.file);
  const file = req.file;
  let filePath;
  if (!file) {
    filePath =
      "https://blog-images-1.pharmeasy.in/blog/production/wp-content/uploads/2021/05/18144539/shutterstock_1772959055-1.jpg";
  } else {
    filePath = process.env.PROJECT_URL + req.file.filename;
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
    productImage: filePath,
    productPrice,
    productStockQuantity,
    productStatus,
  });
  res.status(201).json({
    message: "Product created succesfully!",
  });
};

// API to get products
exports.getProducts = async (req, res) => {
  const products = await Product.find();
  if (products.length == 0) {
    res.status(400).json({
      message: "No product found!",
      products: [],
    });
  } else {
    res.status(200).json({
      message: "Products fetched succesfully!",
      products: products,
    });
  }
};

// API to fetch a single product
exports.getProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({
      mesasge: "please provide the product id",
    });
  }
  const product = await Product.findById(id);
  // check if the product is available or not
  if (!product) {
    return res.status(400).json({
      message: "Product not found!",
      product: [],
    });
  }
  res.status(200).json({
    message: "Product fetched succesfully!",
    product, // destructured since we are using same name
  });
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  if (!id) {
    return res.status(400).json({
      message: "Please provide ID!",
    });
  }

  await Product.findByIdAndDelete(id);
  res.status(200).json({
    message: "Product deleted succesfully!",
  });
};

exports.editProduct = async (req, res) => {
  const { id } = req.params;

  const {
    productName,
    productDescription,
    productPrice,
    productStockQuantity,
    productStatus,
  } = req.body;

  // validating if all the product data are provided or not
  if (
    !productName ||
    !productDescription ||
    !productPrice ||
    !productStockQuantity ||
    !productStatus ||
    !id
  ) {
    return res.status(400).json({
      message: "Please fill in all the product information!",
    });
  }

  const oldData = await Product.findById(id);
  if (!oldData) {
    res.status(400).json({
      message: "No product found with that ID",
    });
  }

  const oldImagePath = oldData.productImage; // fetching the full image path from the previous product data
  const oldImageName = oldImagePath.slice(22); // slicing the path to extract only the filename
  if (req.file && req.file.filename) {
    fs.unlink(`uploads/${oldImageName}`, (err) => {
      if (err) {
        console.log("Error removing the Product Image from file system", err);
      } else {
        console.log("Product Image deleted succesfully!");
      }
    });
  }

  // finally updating the product
  const datas = await Product.findByIdAndUpdate(
    id,
    {
      productName,
      productDescription,
      productImage:
        req.file && req.file.filename
          ? process.env.PROJECT_URL + req.file.filename
          : oldImagePath,
      productPrice,
      productStatus,
      productStockQuantity,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    message: "Product updated succesfully!",
    datas,
  });
};
