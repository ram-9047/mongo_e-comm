const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
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

app.use(bodyParser.urlencoded({ extended: false }));

// app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then((user) => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch((err) => err, "error in finding user");
  next();
});
app.use("/admin", adminRoutes);
app.use(shopRoutes);
// app.use(orderRoutes);

app.use(errorController.get404);

// database relations

const port = 3000;
mongoConnect(() => {
  app.listen(port, () => {
    console.log(`server is started at ${port}`);
  });
});
