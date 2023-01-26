const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const order_item = sequelize.define("order_item", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },

  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = order_item;
