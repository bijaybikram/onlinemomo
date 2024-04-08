const {
  createProduct,
} = require("../controller/admin/product/productController");
const isAuthenticated = require("../middleware/isAuthenticated");
const restrictTo = require("../middleware/restrictTo");

const router = require("express").Router();

// route to create a product
router
  .route("/products")
  .post(isAuthenticated, restrictTo("admin"), createProduct);

module.exports = router;
