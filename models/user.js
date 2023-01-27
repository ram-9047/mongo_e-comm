const mongodb = require("mongodb");
const { getDB } = require("../util/database");

class User {
  constructor(name, email, id) {
    this.name = name;
    this.email = email;
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    const db = getDB();
    let saveUser;

    saveUser = db.collection("user").insertOne(this);

    return saveUser
      .then((result) => {
        console.log("user created in user model");
      })
      .catch((err) => {
        console.log(err);
      });
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
          console.log(user, "user found in user model");
          return user;
        })
        .catch((err) => {
          console.log(err);
        })
    );
  }
}

module.exports = User;
