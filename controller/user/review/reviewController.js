const Product = require("../../../model/productModel");
const Review = require("../../../model/reviewModel");

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

exports.getMyReviews = async () => {
  const userId = req.user.id;
  const reviews = await Review.find({ userId });
  if (reviews.length == 0) {
    res.status(404).json({
      message: "Yo have not reviewed any Product!",
      data: [],
    });
  } else {
    res.status(200).json({
      message: "Reviews fetched succesfully!",
      data: reviews,
    });
  }
};

exports.deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.id;
  const review = await Review.findById(reviewId);
  const ownerIdOfReview = review.userId;

  if (!reviewId) {
    return res.status(400).json({
      message: "Please provide the reviewId",
    });
  }
  if (ownerIdOfReview !== userId) {
    return res.status(400).json({
      message: "You don't have permission to delete this review!",
    });
  }
  await Review.findByIdAndDelete(reviewId);
  res.status(200).json({
    message: "Review deleted succesfully!",
  });
};

//Alternate way of adding reviews using mongodb feature instead of JS CRUD feature

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
