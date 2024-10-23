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
  const productCreated = await Product.create({
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
    data: productCreated,
  });
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const oldData = await Product.findById(id);
  if (!id) {
    return res.status(400).json({
      message: "Please provide ID!",
    });
  }
  fs.unlink(`uploads/${oldData.productImage}`, (err) => {
    if (err) {
      console.log("Error deleting the file from file system");
    } else {
      console.log("File deleted succesfully!");
    }
  });
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
    data: datas,
  });
};

// updating product status
exports.updateProductStatus = async (req, res) => {
  const { id } = req.params;
  const { productStatus } = req.body;
  if (
    !productStatus ||
    !["available", "unavailable"].includes(productStatus.toLowerCase())
  ) {
    return res.status(400).json({
      message: "Please provide valid product status!",
    });
  }
  // finding order
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({
      message: "The product with this Id donot exist!",
    });
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { productStatus },
    {
      new: true,
    }
  );

  res.status(200).json({
    message: "Product status updated succesfully",
    data: updatedProduct,
  });
};

exports.updateProductStockAndPrice = async (req, res) => {
  const { id } = req.params;
  const { productStockQuantity, productPrice } = req.body;
  if (!productStockQuantity && !productPrice) {
    return res.status(400).json({
      message: "Please provide valid product stockQty or price!",
    });
  }
  // finding order
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({
      message: "The product with this Id donot exist!",
    });
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      productStockQuantity: productStockQuantity
        ? productStockQuantity
        : product.productStockQuantity,
      productPrice: productPrice ? productPrice : product.productPrice,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    message: "Product stock and price updated succesfully",
    data: updatedProduct,
  });
};

// API to get product reviews
// exports.getProductReview = async (req, res) => {
//   const productId = req.params.id;
//   if (!productId) {
//     return res.status(400).json({
//       message: "Please provide Product Id",
//     });
//   }
//   const productExist = await Product.findById(productId);
//   // Check if that product exist or not
//   if (!productExist) {
//     return res.status(404).json({
//       message: "Product with that Id doesnot exist",
//     });
//   }
//   const reviews = await Review.find({ productId }).populate("userId");
//   if (reviews.length == 0) {
//     res.status(404).json({
//       message: "No user review found.",
//       reviews: [],
//     });
//   } else {
//     res.status(200).json({
//       message: "Review fetched succesfully.",
//       reviews,
//     });
//   }
// };
