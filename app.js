const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();

//setting view engine
app.set("view engine", "ejs");
app.set("views", "views");

// dependencies import
const path = require("path");
const bodyParser = require("body-parser");

// utils
const errorController = require("./controllers/error");
const { mongoConnect } = require("./util/database");

//Config

dotenv.config({ path: "./config/config.env" });

// routes import
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
// const orderRoutes = require("./routes/order");

//models import
const User = require("./models/user.js");

app.use(bodyParser.urlencoded({ extended: false }));

// app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use((req, res, next) => {
  User.findById("63d59a9430cb3c267a40e001")
    .then((user) => {
      //error
      // console.log(user, "user found in app.js");
      //error
      req.user = user;
      next();
    })
    .catch((err) => err, "error in finding user");
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
// app.use(orderRoutes);

app.use(errorController.get404);

// database relations

const port = 3000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Max",
          email: "max@test.com",
          cart: { items: [] },
        });
        user.save();
      }
    });
    console.log("DB Connected");
    app.listen(port, () => {
      console.log(`server is started at port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err, "error in connection of db or server");
  });
