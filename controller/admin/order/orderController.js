const Order = require("../../../model/orderSchema");

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate({
      path: "items.product",
      model: "Product",
      select: [
        "-productStockQuantity",
        "-createdAt",
        "-updatedAt",
        "-__v",
        "-reviews",
      ],
    })
    .populate({
      path: "user",
      model: "User",
      select: ["userName", "userPhonenumber", "userRole", "userEmail"],
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

exports.getSingleOrder = async (req, res) => {
  const { id } = req.params;
  // Check if that order exist
  const order = await Order.findById(id);
  if (order.length == 0) {
    return res.status(404).json({
      message: "No order found with that id.",
      data: [],
    });
  }
  res.status(200).json({
    message: "Order fetched successfully.",
    data: order,
  });
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;
  if (
    !orderStatus ||
    !["pending", "delivered", "cancelled", "ontheway", "preparing"].includes(
      orderStatus.toLowerCase()
    )
  ) {
    return res.status(400).json({
      message: "Please provide valid order status!",
    });
  }
  // finding order
  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({
      message: "The order with this Id donot exist!",
    });
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { orderStatus },
    {
      new: true,
    }
  )
    .populate({
      path: "items.product",
      model: "Product",
      select: [
        "-productStockQuantity",
        "-createdAt",
        "-updatedAt",
        "-__v",
        "-reviews",
      ],
    })
    .populate({
      path: "user",
      model: "User",
      select: ["userName", "userPhonenumber", "userRole", "userEmail"],
    });
  res.status(200).json({
    message: "Order status updated succesfully",
    data: updatedOrder,
  });
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  // check the existence of order
  const orderExists = await Order.findById(id);
  if (!orderExists) {
    return res.status(404).json({
      message: "Order with that id donot exist!",
    });
  }

  await Order.findByIdAndDelete(id);
  res.status(200).json({
    message: "Order deleted succesfully",
    data: null,
  });
};
