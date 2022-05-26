import request from "supertest";
import app from "../src/Server";

import { addRestaurantForTest, clearDB, loginAsAdmin } from "./index";
import RestaurantService from "../src/services/restaurant.service";
import {
    TEST_DISH0_COST,
    TEST_DISH0_DESCRIPTION,
    TEST_DISH0_NAME
} from "../src/constants";
import { UpdateDishRequest } from "../src/types";

describe('Dishes', () => {
    beforeAll(async () => await clearDB());

    it('update dish', async () => {
        const status = await addRestaurantForTest();

        expect(status).toEqual(201);

        const [restaurant] = await RestaurantService.findAll(undefined);

        const response = await loginAsAdmin();

        const res = await request(app)
            .put('/api/dishes/update')
            .set('Cookie', response.headers['set-cookie'])
            .send(<UpdateDishRequest['body']>{
                id: restaurant.Dishes[0].id,
                name: TEST_DISH0_NAME + 1,
                description: TEST_DISH0_DESCRIPTION + 1,
                cost: TEST_DISH0_COST + 1
            });

        const [restaurantWithUpdatedDishes] = await RestaurantService
            .findAll(undefined);
        const { Dishes } = restaurantWithUpdatedDishes;

        expect(Dishes[0].name).toEqual(TEST_DISH0_NAME + 1);
        expect(Dishes[0].description).toEqual(TEST_DISH0_DESCRIPTION + 1);
        expect(Dishes[0].cost).toEqual(TEST_DISH0_COST + 1);
        expect(Dishes.length).toEqual(2);
    });

    it('delete dish', async () => {
        const response = await loginAsAdmin();

        const [restaurant] = await RestaurantService.findAll(undefined);

        const res = await request(app)
            .delete(`/api/dishes/${restaurant.Dishes[0].id}`)
            .set('Cookie', response.headers['set-cookie']);

        expect(res.status).toEqual(200);

        const [restaurantWithUpdatedDishes] = await RestaurantService
            .findAll(undefined);
        const { Dishes } = restaurantWithUpdatedDishes;

        expect(Dishes[0].name).not.toEqual(TEST_DISH0_NAME + 1);
        expect(Dishes[0].description).not.toEqual(TEST_DISH0_DESCRIPTION + 1);
        expect(Dishes[0].cost).not.toEqual(TEST_DISH0_COST + 1);
        expect(Dishes.length).toEqual(1);
    });

    afterAll(async () => await clearDB());
});
