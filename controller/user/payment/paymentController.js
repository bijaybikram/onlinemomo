const { default: axios } = require("axios");
const Order = require("../../../model/orderSchema");
const User = require("../../../model/userModel");

exports.initiateKhaltiPayment = async (req, res) => {
  const { orderId, amount } = req.body;
  if (!orderId || !amount) {
    return res.status(400).json({
      message: "Please provide orderId and amount.",
    });
  }

  let order = await Order.findById(orderId);
  if (!order) {
    res.status(404).json({
      message: "Order with that Id doesnot exist.",
    });
  }

  // Check if the coming amount is total amount of the order
  if (order.totalAmount !== amount) {
    res.status(400).json({
      message: "Amount must be equal to total amount of the order!",
    });
  }

  const data = {
    return_url: "http://localhost:5173/khaltisuccess",
    purchase_order_id: orderId,
    amount: amount * 100,
    website_url: "http://localhost:3000/",
    purchase_order_name: "testName_" + orderId,
  };

  const response = await axios.post(
    "https://a.khalti.com/api/v2/epayment/initiate/",
    data,
    {
      headers: {
        Authorization: "key e40d62d874c741e3bdfe7028b3587d36",
      },
    }
  );
  console.log(response.data);
  order.paymentDetails.pidx = response.data.pidx;
  await order.save();
  res.status(200).json({
    message: "Payment Succesful!",
    paymentUrl: response.data.payment_url,
  });
};

exports.verifyPidx = async (req, res) => {
  const userId = req.user.id;
  const pidx = req.body.pidx;
  const response = await axios.post(
    "https://a.khalti.com/api/v2/epayment/lookup/",
    { pidx },
    {
      headers: {
        Authorization: "key e40d62d874c741e3bdfe7028b3587d36",
      },
    }
  );
  // console.log(response);
  if (response.data.status === "Completed") {
    // modification on database
    let order = await Order.find({ "paymentDetails.pidx": pidx });
    if (!order) {
      res.status(404).json({
        message: "Order not found for the given pidx!",
      });
    }
    order[0].paymentDetails.method = "khalti";
    order[0].paymentDetails.paymentStatus = "paid";
    await order[0].save();
    // console.log(order[0]);

    // empty user cart
    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });

    res.status(200).json({
      message: "Payment Verified succesfully!",
    });
  }
};
