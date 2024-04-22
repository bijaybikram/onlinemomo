const Product = require("../../../model/productModel");
const User = require("../../../model/userModel");

exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  if (!productId) {
    res.status(400).json({
      message: "Please provide productId.",
    });
  }
  const productExist = await Product.findById(productId);
  if (!productExist) {
    res.status(404).json({
      message: "No product exist with that productId.",
    });
  }
  const user = await User.findById(userId);
  user.cart.push(productId);
  await user.save();
  res.status(200).json({
    message: "Product added to cart succesfully!",
    data: user.cart,
  });
};

exports.getMyCartItems = async (req, res) => {
  const userId = req.user.id;
  const userData = await User.findById(userId).populate({
    path: "cart",
    select: "-productStatus",
  });
  res.status(200).json({
    message: "Cart fetched succesfully!",
    data: userData.cart,
  });
};

exports.deleteMyCartItem = async (req, res) => {
  //   const { productId } = req.params;  // use params for deleting a single product from cart implementing filter on the cart data
  const { productIds } = req.body;
  // check if that product exist or not
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      message: "Product with that id not found! ",
    });
  }
  const userId = req.user.id;
  const user = await User.findById(userId);
  productIds.forEach((productId) => {
    user.cart = user.cart.filter((pId) => pId != productId);
  });

  await user.save();
  res.status(200).json({
    message: "Cart Item removed successfully!",
    data: user.cart,
  });
};
