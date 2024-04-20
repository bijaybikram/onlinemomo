const Product = require("../../model/productModel");
const Review = require("../../model/reviewModel");

// API to get products
exports.getProducts = async (req, res) => {
  // Alternate to make reviews attached with product using schema model
  // const products = await Product.find().populate({
  //   path: "reviews",
  //   populate: {
  //     path: "userId",
  //     select: "userName userEmail",
  //   },
  // });
  const products = await Product.find();
  if (products.length == 0) {
    res.status(400).json({
      message: "No product found!",
      data: [],
    });
  } else {
    res.status(200).json({
      message: "Products fetched succesfully!",
      data: products,
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
  const productReviews = await Review.find({ productId: id }).populate(
    "userId"
  );
  // check if the product is available or not
  if (!product) {
    return res.status(400).json({
      message: "Product not found!",
      data: { product: [], productReviews: [] },
    });
  }
  res.status(200).json({
    message: "Product fetched succesfully!",
    data: { product, productReviews }, // destructured since we are using same name
  });
};
