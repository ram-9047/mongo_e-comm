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
  //1st method
  // Product.findByPk(prodId)
  //   .then((product) => {
  //     res.render("shop/product-detail", {
  //       product: product,
  //       pageTitle: product.title,
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => console.log(err));

  //2nd method
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

// exports.getCart = (req, res, next) => {
//   // console.log(req.user, "user in cart");
//   req.user
//     .getCart()
//     .then((cart) => {
//       // console.log(cart, "this is cart");
//       return cart
//         .getProducts()
//         .then((products) => {
//           // res.render("shop/cart", {
//           //   path: "/cart",
//           //   pageTitle: "Your Cart",
//           //   products: products,
//           // });
//           res.json({ products, success: true });
//         })
//         .catch((err) =>
//           console.log(err, "error in getting prodcuts avail in cart")
//         );
//     })
//     .catch((err) => console.log(err, "error in getting cart table"));
// };

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  // console.log(req.body, "id in backend");
  console.log(req.user);
  const product = Product.findByID(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result, "result of cart post -controller");
    })
    .catch((err) => {
      console.log(err);
    });

  // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .addToCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then((products) => {
  //     // if that product is already in the cart then increase the product quantity
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }

  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     }

  //     //if product is not in the cart then find the product from products and add it in cart
  //     return Product.findByPk(prodId);
  //   })
  //   .then((product) => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity },
  //     });
  //   })
  //   .then(() => {
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => console.log(err, "error in post cart"));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err, "error in deleting product from cart");
    });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
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
