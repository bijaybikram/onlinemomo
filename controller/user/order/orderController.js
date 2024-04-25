const Order = require("../../../model/orderSchema");

exports.createMyOrder = async (req, res) => {
  const userId = req.user.id;
  const { items, totalAmount, shippingAddress, paymentDetails } = req.body;
  if (
    !items.length > 0 ||
    !totalAmount ||
    !shippingAddress ||
    !paymentDetails
  ) {
    return res.status(400).json({
      message:
        "Please provide item, totalAmount, shippingAddress, paymentDetails.",
    });
  }
  // insert into orders
  await Order.create({
    user: userId,
    items,
    totalAmount,
    shippingAddress,
    paymentDetails,
  });
  res.status(200).json({
    message: "Order placed Succesfully",
  });
};

exports.getMyOrders = async (req, res) => {
  const userId = req.user.id;
  const orders = await Order.find({ user: userId }).populate({
    path: "items.product",
    model: "Product",
    select: [
      "-productStockQuantity",
      "-createdAt",
      "-updatedAt",
      "-__v",
      "-reviews",
    ],
  });
  if (orders.length == 0) {
    return res.status(404).json({
      message: "No orders found!",
      data: [],
    });
  }
  res.status(200).json({
    message: "Order fetched successfully.",
    data: orders,
  });
};
