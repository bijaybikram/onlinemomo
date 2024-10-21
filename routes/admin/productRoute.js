const {
  createProduct,
  deleteProduct,
  editProduct,
  updateProductStatus,
  updateProductStockAndPrice,
} = require("../../controller/admin/product/productController");
const {
  getProducts,
  getProduct,
} = require("../../controller/global/globalController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const restrictTo = require("../../middleware/restrictTo");

const router = require("express").Router();
const { multer, storage } = require("../../middleware/multerConfig");
const catchAsync = require("../../services/catchAsync");
const upload = multer({ storage: storage });

// route to create a product
router
  .route("/")
  .post(
    isAuthenticated,
    restrictTo("admin"),
    upload.single("productImage"),
    catchAsync(createProduct)
  )
  .get(catchAsync(getProducts));

router
  .route("/productstatus/:id")
  .patch(isAuthenticated, restrictTo("admin"), catchAsync(updateProductStatus));

router
  .route("/stockprice/:id")
  .patch(
    isAuthenticated,
    restrictTo("admin"),
    catchAsync(updateProductStockAndPrice)
  );

router
  .route("/:id")
  .get(catchAsync(getProduct))
  .delete(isAuthenticated, restrictTo("admin"), catchAsync(deleteProduct))
  .patch(
    isAuthenticated,
    restrictTo("admin"),
    upload.single("productImage"),
    catchAsync(editProduct)
  );

module.exports = router;
