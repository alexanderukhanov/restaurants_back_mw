import request from "supertest";
import app from "../src/Server";

import { addRestaurantForTest, clearDB } from "./index";
import RestaurantService from "../src/services/restaurant.service";

describe('Images', () => {
    beforeAll(async () => await clearDB());

    it('get image', async () => {
        const status = await addRestaurantForTest();

        expect(status).toEqual(201);

        const [restaurant] = await RestaurantService.findAll(undefined);

        const res = await request(app).get(`/api/images/${restaurant.previewLink}`);

        expect(res.text).not.toMatch('ENOENT');
    });

    afterAll(async () => await clearDB());
});
