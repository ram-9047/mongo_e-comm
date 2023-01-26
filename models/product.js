const { getDB } = require("../util/database.js");

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDB();
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => {
        console.log(result, "this is a result");
      })
      .catch((err) => {
        console.log(err, "error in inserting");
      });
  }

  static fetchAll() {
    const db = getDB()
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => {
        console.log(err, "error in fetching product model");
      });
  }
}

module.exports = Product;
