const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
});

module.exports = order;
