const { default: axios } = require("axios");
const Order = require("../../../model/orderSchema");

exports.initiateKhaltiPayment = async (req, res) => {
  const { orderId, amount } = req.body;
  if (!orderId || !amount) {
    return res.status(400).json({
      message: "Please provide orderId and amount.",
    });
  }

  const orderExists = Order.findById(orderId);
  if (!orderExists) {
    res.status(404).json({
      message: "Order with that Id doesnot exist.",
    });
  }

  const data = {
    return_url: "http://localhost:3000/api/payment/success",
    purchase_order_id: orderId,
    purchase_order_name: "testName_" + orderId,
    amount: amount,
    website_url: "http://localhost:3000/",
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
  let order = await Order.findById(orderId);
  order.paymentDetails.pidx = response.data.pidx;
  await order.save();
  res.redirect(response.data.payment_url);
};

exports.verifyPidx = async (req, res) => {
  const { pidx } = req.query;
  const response = await axios.post(
    "https://a.khalti.com/api/v2/epayment/lookup/",
    { pidx },
    {
      headers: {
        Authorization: "key e40d62d874c741e3bdfe7028b3587d36",
      },
    }
  );
  if (response.data.status == "Completed") {
    // modification on database
    let order = await Order.find({ "paymentDetails.pidx": pidx });
    order[0].paymentDetails.method = "khalti";
    order[0].paymentDetails.paymentStatus = "paid";
    await order[0].save();
    // notify to front-end
    res.redirect("http://localhost:3000");
  } else {
    // notify error to front-end
    res.redirect("http://localhost:3000/errorPage");
  }
  // res.send(response.data);
};
