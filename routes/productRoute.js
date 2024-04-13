const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
} = require("../controller/admin/product/productController");
const isAuthenticated = require("../middleware/isAuthenticated");
const restrictTo = require("../middleware/restrictTo");

const router = require("express").Router();
const { multer, storage } = require("../middleware/multerConfig");
const catchAsync = require("../services/catchAsync");
const upload = multer({ storage: storage });

// route to create a product
router
  .route("/products")
  .post(
    isAuthenticated,
    restrictTo("admin"),
    upload.single("productImage"),
    catchAsync(createProduct)
  )
  .get(catchAsync(getProducts));

router
  .route("/products/:id")
  .get(catchAsync(getProduct))
  .post(isAuthenticated, restrictTo("admin"), catchAsync(deleteProduct));

module.exports = router;
