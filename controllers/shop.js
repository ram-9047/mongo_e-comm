const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
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

  Product.findByID(prodId)
    .then((products) => {
      res.render("shop/product-detail", {
        product: products,
        pageTitle: products.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
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
    .getCart()
    .then((products) => {
      // console.log(cart, "this is cart");
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Cart",
        products,
      });
    })
    .catch((err) => console.log(err, "error in getting cart table"));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  // console.log(req.body, "id in backend");
  // console.log(req.user);
  const product = Product.findByID(prodId)
    .then((product) => {
      return req.user.addToCart(product);
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
  req.user.getOrder().then((result) => {
    console.log(result, "line 88");
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: result,
    });
  });
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then((result) => {
      res.redirect("/order");
    })
    .catch((err) => {
      console.log(err, "error in post order controller");
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
