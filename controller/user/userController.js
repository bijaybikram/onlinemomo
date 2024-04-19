const Product = require("../../model/productModel");
const Review = require("../../model/reviewModel");

exports.createReview = async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.id;
  //   console.log(userId);
  //   return;
  const { rating, feedback } = req.body;

  if (!rating || !feedback || !productId) {
    return res.status(400).json({
      message: "Please provide rating and feedback!",
    });
  }
  //   check if the product exist or not
  const productExist = await Product.findById(productId);
  if (!productExist) {
    return res.status(404).json({
      message: "Prodict with that Id doesnot exist.",
    });
  }

  //   Insert them into Review collection
  await Review.create({
    userId,
    productId,
    rating,
    feedback,
  });
  res.status(200).json({
    message: "Review created succesfully!",
  });
};

exports.getProductReview = async (req, res) => {
  const productId = req.params.id;
  if (!productId) {
    return res.status(400).json({
      message: "Please provide Product Id",
    });
  }
  const productExist = await Product.findById(productId);
  // Check if that product exist or not
  if (!productExist) {
    return res.status(404).json({
      message: "Product with that Id doesnot exist",
    });
  }
  const reviews = await Review.find({ productId }).populate("userId");
  if (reviews.length == 0) {
    res.status(404).json({
      message: "No user review found.",
      data: [],
    });
  } else {
    res.status(200).json({
      message: "Review fetched succesfully.",
      data: reviews,
    });
  }
};

exports.deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  if (!reviewId) {
    return res.status(400).json({
      message: "Please provide the reviewId",
    });
  }
  await Review.findByIdAndDelete(reviewId);
  res.status(200).json({
    message: "Review deleted succesfully!",
  });
};

//Alternate way of add reviews using mongodb feature instead of JS CRUD feature

// exports.addProductReview = async (req, res) => {
//   const userId = req.user.id;
//   const productId = req.params.id;
//   const { rating, feedback } = req.body;
//   const review = {
//     userId,
//     rating,
//     feedback,
//   };
//   const product = await Product.findById(productId);
//   product.reviews.push(review);
//   await product.save();
//   res.status(200).json({
//     message: "review created",
//   });
// };
