const Order = require("../../model/orderSchema");
const Product = require("../../model/productModel");
const User = require("../../model/userModel");

class DataService {
  async getData(req, res) {
    const users = (await User.find()).length;
    const products = (await Product.find()).length;
    const orders = (await Order.find()).length;
    const allOrders = await Order.find()
      .populate({
        path: "items.product",
        model: "Product",
      })
      .populate("user");
    res.status(200).json({
      message: "Data Fetched succesfully!",
      data: {
        users,
        products,
        orders,
        allOrders,
      },
    });
  }
}

const DataServices = new DataService();
module.exports = DataServices;
