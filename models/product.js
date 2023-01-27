const mongodb = require("mongodb");
const { getDB } = require("../util/database.js");

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = new mongodb.ObjectId(id);
  }

  save() {
    const db = getDB();
    let saveOp;
    if (this._id) {
      //update the product
      saveOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      // add new product
      saveOp = db.collection("products").insertOne(this);
    }
    return saveOp
      .then((result) => {
        console.log(result, "this is a result");
      })
      .catch((err) => {
        console.log(err, "error in inserting");
      });
  }

  static fetchAll() {
    const db = getDB();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => {
        console.log(err, "error in fetching product model");
      });
  }

  static findByID(prodId) {
    const db = getDB();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then((product) => {
        // console.log(product);
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static deleteByID(prodId) {
    const db = getDB();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then((result) => {
        console.log("deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Product;
