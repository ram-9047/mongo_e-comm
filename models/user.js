const mongodb = require("mongodb");
const { getDB } = require("../util/database");

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    const db = getDB();
    let saveUser;

    saveUser = db.collection("user").insertOne(this);

    return saveUser
      .then((result) => {
        console.log(result, "user created in user model");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getCart() {
    const db = getDB();
    const productIDs = this.cart.items.map((e) => {
      return e.productId;
    });
    return db
      .collection("products")
      .find({ _id: { $in: productIDs } })
      .toArray()
      .then((products) => {
        return products.map((e) => {
          return {
            ...e,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === e._id.toString();
            }).quantity,
          };
        });
      });
  }

  addToCart(product) {
    // If product already exist in the cart then find the product and increase the quantity
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    let updatedCartItem = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItem[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItem.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    // if the product doesnt exist in the cart
    const updatedCart = {
      items: updatedCartItem,
    };

    const db = getDB();
    return db
      .collection("user")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter((e) => {
      return e.productId.toString() !== productId.toString();
    });

    const db = getDB();
    return db.collection("user").updateOne(
      {
        _id: new mongodb.ObjectId(this._id),
      },
      { $set: { cart: { items: updatedCartItems } } }
    );
  }

  static findById(userId) {
    const db = getDB();
    return (
      db
        .collection("user")
        // .find({ _id: new mongodb.ObjectId(userId) })
        // .next()
        .findOne({ _id: new mongodb.ObjectId(userId) })
        .then((user) => {
          // error
          // console.log(user, "user found in user model");
          //error
          return user;
        })
        .catch((err) => {
          console.log(err);
        })
    );
  }
}

module.exports = User;
