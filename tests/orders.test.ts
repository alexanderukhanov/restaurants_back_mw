import request from "supertest";
import app from "../src/Server";

import { addRestaurantForTest, clearDB, loginAsAdmin } from "./index";
import RestaurantService from "../src/services/restaurant.service";
import { AMOUNT_DISH0, AMOUNT_DISH1 } from "../src/constants";
import { CreateOrderRequest } from "../src/types";
import OrderService from "../src/services/order.service";
import { initDishInOrder } from "../src/db/models/dishInOrder.model";

const DishInOrder = module.require('../src/db/models').DishInOrder as ReturnType<typeof initDishInOrder>

describe('Orders', () => {
    beforeAll(async () => await clearDB());

    it('add order', async () => {
        const status = await addRestaurantForTest();

        expect(status).toEqual(201);

        const [restaurant] = await RestaurantService.findAll(undefined);
        const { Dishes } = restaurant;
        const totalCost = `${
            Number(Dishes[0].cost) * AMOUNT_DISH0 + Number(Dishes[1].cost) * AMOUNT_DISH1 
        }`;
        const data = <CreateOrderRequest['body']>{
            restaurantId: restaurant.id,
            dishes: [
                {
                    id: Dishes[0].id,
                    name: Dishes[0].name,
                    amount: AMOUNT_DISH0
                },
                {
                    id: Dishes[1].id,
                    name: Dishes[1].name,
                    amount: AMOUNT_DISH1
                }
            ],
            totalCost
        };

        const response = await loginAsAdmin();

        const res = await request(app)
            .post('/api/orders/add')
            .set('Cookie', response.headers['set-cookie'])
            .send(data);

        const [order] = await OrderService.findAll();

        expect(res.status).toEqual(201);
        expect(order.totalCost).toEqual(totalCost);
        expect(order.isPaid).toEqual(false);
        expect(order.restaurantId).toEqual(restaurant.id);

        const [dish0InOrder, dish1InOrder] = await DishInOrder.findAll();

        expect(dish0InOrder.dishId).toEqual(Dishes[0].id);
        expect(dish0InOrder.orderId).toEqual(order.id);
        expect(dish0InOrder.amount).toEqual(AMOUNT_DISH0);
        expect(dish1InOrder.dishId).toEqual(Dishes[1].id);
        expect(dish1InOrder.orderId).toEqual(order.id);
        expect(dish1InOrder.amount).toEqual(AMOUNT_DISH1);
    });

    it('delete order', async () => {
        const response = await loginAsAdmin();

        const [order] = await OrderService.findAll();

        const res = await request(app)
            .delete(`/api/orders/${order.id}`)
            .set('Cookie', response.headers['set-cookie']);

        const [orderAfterDelete] = await OrderService.findAll();

        expect(res.status).toEqual(200);
        expect(orderAfterDelete).toBeUndefined();
    });

    afterAll(async () => await clearDB());
});
