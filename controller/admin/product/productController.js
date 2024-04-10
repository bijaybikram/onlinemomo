const Product = require("../../../model/productModel");

exports.createProduct = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
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
