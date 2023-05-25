import request from "supertest";
import app from "../src/Server";

import { RestaurantCreationAttributes } from "../src/db/models/restaurant.model";
import { DishCreationAttributes } from "../src/db/models/dish.model";
import {
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    TEST_DISH0_COST,
    TEST_DISH0_DESCRIPTION,
    TEST_DISH0_NAME,
    TEST_DISH1_COST,
    TEST_DISH1_DESCRIPTION,
    TEST_DISH1_NAME,
    TEST_EMAIL,
    TEST_IMAGE_BASE64,
    TEST_PASSWORD,
    TEST_RESTAURANT_ADDRESS,
    TEST_RESTAURANT_NAME,
    TEST_RESTAURANT_TYPE
} from "../src/constants";

const UserLikes = module.require('../src/db/models').UserLikes;
const DishInOrder = module.require('../src/db/models').DishInOrder;
const Order = module.require('../src/db/models').Order;
const Dish = module.require('../src/db/models').Dish;
const Restaurant = module.require('../src/db/models').Restaurant;
const User = module.require('../src/db/models').User;

export const clearDB = async () => {
    await UserLikes.destroy({truncate: { cascade: true }});
    await DishInOrder.destroy({truncate: { cascade: true }});
    await Order.destroy({truncate: { cascade: true }});
    await Dish.destroy({truncate: { cascade: true }});
    await Restaurant.destroy({truncate: { cascade: true }});
    await User.destroy({truncate: { cascade: true }});
};

export const loginAsAdmin = async () =>
    request(app)
        .post('/api/auth/login')
        .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });

export const loginAsUser = async () =>
    request(app)
        .post('/api/auth/login')
        .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

export const addRestaurantForTest = async () => {
    const response = await loginAsAdmin();

    const data = {
        restaurant: <Partial<RestaurantCreationAttributes>>{
            name: TEST_RESTAURANT_NAME,
            type: TEST_RESTAURANT_TYPE,
            address: TEST_RESTAURANT_ADDRESS,
            previewLink: TEST_IMAGE_BASE64
        },
        dishes: <Partial<DishCreationAttributes[]>>[
            {
                name: TEST_DISH0_NAME,
                cost: TEST_DISH0_COST,
                description: TEST_DISH0_DESCRIPTION,
                previewLink: TEST_IMAGE_BASE64,
            },
            {
                name: TEST_DISH1_NAME,
                cost: TEST_DISH1_COST,
                description: TEST_DISH1_DESCRIPTION,
                previewLink: TEST_IMAGE_BASE64,
            }
        ]
    };

    const res = await request(app)
        .post('/api/restaurants/add')
        .set('Cookie', response.headers['set-cookie'])
        .send(data);

    return res.status;
};
