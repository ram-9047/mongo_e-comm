const mongoDB = require("mongodb");
const MongoClient = mongoDB.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(process.env.MONGO_URL)
    .then((client) => {
      console.log("MongoDB connected");
      _db = client.db();
      callback(client);
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDB = () => {
  if (_db) {
    return _db;
  }
  throw "no databse found";
};

module.exports = { mongoConnect, getDB };

// exports.mongoConnect = mongoConnect;
// exports.getDB = getDB;
