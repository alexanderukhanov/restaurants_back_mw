'use strict';

import { initUser } from './user.model';
import { initRestaurant } from './restaurant.model';
import { initDish } from './dish.model';
import { initOrder } from './order.model';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../../src/db/config/config.json')[env];
const db = {};

let sequelize: any;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
    .readdirSync(__dirname)
    .filter((file: any) => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach((file: any) => {
      // @ts-ignore
      const model = Object.values(require(path.join(__dirname, file)))[0](sequelize);
      // @ts-ignore
      db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
  // @ts-ignore
  if (db[modelName].associate) {
    // @ts-ignore
    db[modelName].associate(db);
  }
});

// @ts-ignore
db.sequelize = sequelize;
// @ts-ignore
db.Sequelize = Sequelize;

const User = initUser(sequelize);
const Restaurant = initRestaurant(sequelize);
const Dish = initDish(sequelize);
const Order = initOrder(sequelize);

Restaurant.hasOne(Order, { foreignKey: 'restaurantId', onDelete: 'NO ACTION' })
Dish.belongsToMany(Order, { through: 'Order_Dish' })
Order.belongsToMany(Dish, { through: 'Order_Dish' })
User.hasOne(Order, { foreignKey: 'userId'})
Restaurant.hasMany(Dish, { foreignKey: 'restaurantId' })

module.exports = db;

module.exports.User = User;
module.exports.Restaurant = Restaurant;
module.exports.Dish = Dish;
module.exports.Order = Order;
