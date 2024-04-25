const Order = require("../../../model/orderSchema");

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate({
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
