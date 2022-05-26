import request from 'supertest';
import app from "../src/Server";

import { clearDB, addRestaurantForTest, loginAsAdmin, loginAsUser } from "./index";
import RestaurantService from "../src/services/restaurant.service";
import {
    TEST_DISH0_COST,
    TEST_DISH0_DESCRIPTION,
    TEST_DISH0_NAME,
    TEST_DISH1_COST,
    TEST_DISH1_DESCRIPTION,
    TEST_DISH1_NAME,
    TEST_RESTAURANT_ADDRESS,
    TEST_RESTAURANT_NAME,
    TEST_RESTAURANT_TYPE
} from "../src/constants";
import { UpdateRestaurantRequest } from "../src/types";

describe('Restaurants', () => {
    beforeAll(async () => await clearDB());

    it('add restaurant', async () => {
        const status = await addRestaurantForTest();

        expect(status).toEqual(201);

        const [restaurant] = await RestaurantService.findAll(undefined);

        expect(restaurant.name).toEqual(TEST_RESTAURANT_NAME);
        expect(restaurant.type).toEqual(TEST_RESTAURANT_TYPE);
        expect(restaurant.address).toEqual(TEST_RESTAURANT_ADDRESS);

        expect(restaurant.Dishes[0].restaurantId).toEqual(restaurant.id);
        expect(restaurant.Dishes[0].name).toEqual(TEST_DISH0_NAME);
        expect(restaurant.Dishes[0].description).toEqual(TEST_DISH0_DESCRIPTION);
        expect(restaurant.Dishes[0].cost).toEqual(TEST_DISH0_COST);

        expect(restaurant.Dishes[1].restaurantId).toEqual(restaurant.id);
        expect(restaurant.Dishes[1].name).toEqual(TEST_DISH1_NAME);
        expect(restaurant.Dishes[1].description).toEqual(TEST_DISH1_DESCRIPTION);
        expect(restaurant.Dishes[1].cost).toEqual(TEST_DISH1_COST);
    });

    it('update restaurant', async () => {
        const [restaurant] = await RestaurantService.findAll(undefined);

        const response = await loginAsAdmin();

        const data = <Partial<UpdateRestaurantRequest['body']>>{
            id: restaurant.id,
            name: TEST_RESTAURANT_NAME + '1',
            type: TEST_RESTAURANT_TYPE + '1',
            address: TEST_RESTAURANT_ADDRESS + '1',
        };

        const res = await request(app)
            .put('/api/restaurants/update')
            .set('Cookie', response.headers['set-cookie'])
            .send(data);

        expect(res.status).toEqual(200);

        const [updatedRestaurant] = await RestaurantService.findAll(undefined);

        expect(updatedRestaurant.name).toEqual(TEST_RESTAURANT_NAME + '1');
        expect(updatedRestaurant.type).toEqual(TEST_RESTAURANT_TYPE + '1');
        expect(updatedRestaurant.address).toEqual(TEST_RESTAURANT_ADDRESS + '1');
    });

    it('restaurant like', async () => {
        const response = await loginAsUser();

        const {body: { id }} = await request(app)
            .get('/api/users/profile')
            .set('Cookie', response.headers['set-cookie']);

        const [restaurant] = await RestaurantService.findAll(id);
        const resFirst = await request(app)
            .put('/api/restaurants/likeRestaurant')
            .set('Cookie', response.headers['set-cookie'])
            .send(<Partial<UpdateRestaurantRequest['body']>>{ id: restaurant.id });

        const [updatedRestaurantAfterFirstRequest] = await RestaurantService.findAll(id);

        expect(resFirst.status).toEqual(200);
        expect(updatedRestaurantAfterFirstRequest.likes).toEqual(1);

        const resSecond = await request(app)
            .put('/api/restaurants/likeRestaurant')
            .set('Cookie', response.headers['set-cookie'])
            .send(<Partial<UpdateRestaurantRequest['body']>>{ id: restaurant.id });

        const [updatedRestaurantAfterSecondRequest] = await RestaurantService.findAll(id);

        expect(resSecond.status).toEqual(200);
        expect(updatedRestaurantAfterSecondRequest.likes).toEqual(0);
    });

    it('get restaurants', async () => {
        const res = await request(app).get('/api/restaurants/all');
        const [restaurant] = res.body;

        expect(restaurant.name).toEqual(TEST_RESTAURANT_NAME + '1');
        expect(restaurant.type).toEqual(TEST_RESTAURANT_TYPE + '1');
        expect(restaurant.address).toEqual(TEST_RESTAURANT_ADDRESS + '1');
        expect(restaurant.likes).toEqual(0);

        expect(restaurant.Dishes[0].restaurantId).toEqual(restaurant.id);
        expect(restaurant.Dishes[0].name).toEqual(TEST_DISH0_NAME);
        expect(restaurant.Dishes[0].description).toEqual(TEST_DISH0_DESCRIPTION);
        expect(restaurant.Dishes[0].cost).toEqual(TEST_DISH0_COST);

        expect(restaurant.Dishes[1].restaurantId).toEqual(restaurant.id);
        expect(restaurant.Dishes[1].name).toEqual(TEST_DISH1_NAME);
        expect(restaurant.Dishes[1].description).toEqual(TEST_DISH1_DESCRIPTION);
        expect(restaurant.Dishes[1].cost).toEqual(TEST_DISH1_COST);
    });

    it('delete restaurant', async () => {
        const response = await loginAsAdmin();

        const [restaurant] = await RestaurantService.findAll(undefined);

        const res = await request(app)
            .delete(`/api/restaurants/${restaurant.id}`)
            .set('Cookie', response.headers['set-cookie']);

        const [restaurantAfterDelete] = await RestaurantService.findAll(undefined);

        expect(res.status).toEqual(200);
        expect(restaurantAfterDelete).toBeUndefined();
    });

    afterAll(async () => await clearDB());
})
