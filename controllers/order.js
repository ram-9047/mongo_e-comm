const Product = require("../models/product");
const Cart = require("../models/cart");
const Cart_Item = require("../models/cart-item");

const Order = require("../models/order");
const Order_item = require("../models/order_item");
// const order = require("../models/order");

exports.postOrder = async (req, res, next) => {
  // console.log("inside post order routes");
  let orderId = await req.user.createOrder();
  // console.log(Object.keys(req.user.__proto__));
  // console.log(orderId, "this is user");
  let totalOrderedItems = [];

  req.user
    .getCart()
    .then((cart) => {
      // console.log(cart);
      cart.getProducts().then((products) => {
        products.forEach((product) => {
          console.log(product);
          // console.log(product.title, product.cartItem.quantity);
          orderId.addProduct(product, {
            through: { quantity: product.cartItem.quantity },
          });
          totalOrderedItems.push({ product: product.cartItem.quantity });
        });
        Cart_Item.destroy({ where: { cartId: cart.id } })
          .then((res) => {
            console.log(res, "cart deleted");
          })
          .catch((err) => {
            console.log(err, "cart not deleted");
          });
        res.status(200).json({ orderId, sucess: true });
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.getOrder = (req, res, next) => {
  let result = [];
  Order.findAll()
    .then(async (orders) => {
      // console.log(orders.length);
      for (let i = 0; i < orders.length; i++) {
        let productsArray = [];
        let orderId = { orderid: orders[i] };
        // console.log(orders[i].id, "order id");
        let orderProducts = await Order_item.findAll({
          where: { orderId: orders[i].id },
        });
        // console.log(orders[i].id, orderProducts, "order products");
        for (let j = 0; j < orderProducts.length; j++) {
          let productId = orderProducts[j].dataValues.productId;
          let product = await Product.findByPk(productId);
          // console.log(
          //   productId,
          //   "this is product id",
          //   orders[i].id,
          //   "this is order id"
          // );
          productsArray.push(product);
        }
        orderId["Product"] = productsArray;
        result.push(orderId);
      }
      // console.log(result, "final result");
      res.status(200).json({ result });

      // -----
    })
    .catch((err) => {
      console.log(err, "error in finding orders ");
    });
};
