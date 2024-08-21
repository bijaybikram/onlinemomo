const Order = require("../../../model/orderSchema");
const User = require("../../../model/userModel");

exports.createMyOrder = async (req, res) => {
  const userId = req.user.id;
  const { items, totalAmount, shippingAddress, phoneNumber, paymentDetails } =
    req.body;
  if (
    !items.length > 0 ||
    !totalAmount ||
    !shippingAddress ||
    !phoneNumber ||
    !paymentDetails
  ) {
    return res.status(400).json({
      message:
        "Please provide item, totalAmount, shippingAddress, phoneNumber & paymentDetails.",
    });
  }
  // insert into orders
  const createdOrder = await Order.create({
    user: userId,
    items,
    totalAmount,
    shippingAddress,
    phoneNumber,
    paymentDetails,
  });
  if (createdOrder.paymentDetails.method === "COD") {
    // empty user cart

    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });
  }
  res.status(200).json({
    data: createdOrder,
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

exports.updateMyOrder = async (req, res) => {
  const userId = req.user.id;
  console.log(userId);
  const { id } = req.params;
  const { shippingAddress, items } = req.body;
  if (!shippingAddress || items.length == 0) {
    return res.status(400).json({
      message: "Please provide shipping addresss and items",
    });
  }
  const existingOrder = await Order.findById(id);
  if (!existingOrder) {
    return res.status(404).json({
      message: "Order with that Id donot exist.",
    });
  }

  // Check if the User trying to update is the User who ordered
  if (existingOrder.user.toString() !== userId) {
    return res.status(400).json({
      message:
        "This is not your order. You have no authority to modify this order!",
    });
  }

  if (existingOrder.orderStatus == "ontheway") {
    return res.status(400).json({
      message: "You cannot update the order while it is on the way.",
    });
  }
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      items,
      shippingAddress,
    },
    { new: true }
  );
  res.status(200).json({
    message: "Order succesfully updated!",
    data: updatedOrder,
  });
};

exports.deleteMyOrder = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  // check if the order exist or not
  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({
      message: "The order with this Id donot exist!",
    });
  }

  if (order.user.toString() !== userId) {
    return res.status(400).json({
      message: "This is not your order. You cannot delete this order!",
    });
  }

  await Order.findByIdAndDelete(id);
  res.status(200).json({
    message: "Order deleted Succesfully",
    data: null,
  });
};

exports.cancelMyOrder = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.body;

  // finding order
  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({
      message: "The order with this Id donot exist!",
    });
  }

  if (order.user.toString() !== userId) {
    return res.status(400).json({
      message: "This is not your order. You cannot cancel this order!",
    });
  }

  if (existingOrder.orderStatus !== "pending") {
    return res.status(400).json({
      message:
        "You cannot cancel this order as it is not on the pending state.",
    });
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      orderStatus: "cancelled",
    },
    { new: true }
  );
  res.status(200).json({
    message: "Order cancelled succesfully",
    data: updatedOrder,
  });
};
