const Product = require("../models/product");
const Order = require("../models/order.js");
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
      // res.json({ products, success: true });
    })
    .catch((err) => console.log(err, "error in fecthing products line-18"));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err, "error in get all products"));
};

exports.getCart = (req, res, next) => {
  // console.log(req.user, "user in cart");
  req.user
    // .getCart()
    .populate("cart.items.productId")
    // .execPopulate()
    .then((user) => {
      // console.log(user.cart.items, "this is cart");
      let product = [...user.cart.items];
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Cart",
        products: product,
      });
    })
    .catch((err) => console.log(err, "error in getting cart table"));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  const product = Product.findById(prodId)
    .then((product) => {
      req.user.addToCart(product);
    })
    .then((result) => {
      // console.log(result, "result of cart post -controller");
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err, "error in deleting product from cart");
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id }).then((result) => {
    // console.log(result, "line 88");
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: result,
    });
  });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc },
        };
      });
      // console.log(products, "porudcts line 108");
      let order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then(() => {
      req.user.clearCart();
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.limitProduct = (req, res, next) => {
  console.log(req.query.page);
  let page = req.query.page;
  let limitItems = 2;
  Product.findAll({ limit: 2, offset: limitItems * page })
    .then((products) => {
      res.status(200).json({ products, success: true });
    })
    .catch((err) => {
      console.log(err, "error in limiting product route");
    });
};
