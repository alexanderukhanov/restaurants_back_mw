'use strict';
import fs from "fs";
import { Sequelize } from "sequelize";
import path from "path";

import { initUser } from "./user.model";
import { initRestaurant } from "./restaurant.model";
import { initDish } from "./dish.model";
import { initOrder } from "./order.model";
import { initUserLikes } from "./userLikes.model";
import { initDishInOrder } from "./dishInOrder.model";

const basename = path.basename(__filename);
const db = <Record<string, any>>{};

export const sequelize = new Sequelize({
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    logging: false,
});

fs
    .readdirSync(__dirname)
    .filter((file: string) => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach((file: string) => {
      const model = (Object.values(require(path.join(__dirname, file)))[0] as Function)(sequelize);
      db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
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
