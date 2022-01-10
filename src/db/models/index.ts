'use strict';

import { initUser } from './user.model';
import { initRestaurant } from './restaurant.model';
import { initDish } from './dish.model';
import { initOrder } from './order.model';
import { initUserLikes } from './userLikes.model';
import { initDishInOrder } from './dishInOrder.model';
import fs from 'fs';
import { Sequelize } from 'sequelize';
import path from 'path';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../../src/db/config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

fs
    .readdirSync(__dirname)
    .filter((file: string) => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach((file: string) => {
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
const UserLikes = initUserLikes(sequelize);
UserLikes.removeAttribute('id');
const DishInOrder = initDishInOrder(sequelize);
DishInOrder.removeAttribute('id');

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
module.exports.UserLikes = UserLikes;
module.exports.DishInOrder = DishInOrder;
