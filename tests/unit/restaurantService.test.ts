import { clearDB } from "../index";
import RestaurantService from "../../src/services/restaurant.service";
import {
    generatedJwtSecret,
    TEST_IMAGE_BASE64,
    TEST_RESTAURANT_ADDRESS,
    TEST_RESTAURANT_LIKES,
    TEST_RESTAURANT_TYPE,
} from "../../src/constants";

describe('restaurant service', () => {
    let restaurantId: number;

    beforeAll(async () => {
        await clearDB();
    });

    it('add', async () => {
        const restaurant = await RestaurantService.add({
            name: generatedJwtSecret,
            type: TEST_RESTAURANT_TYPE,
            address: TEST_RESTAURANT_ADDRESS,
            previewLink: TEST_IMAGE_BASE64,
            likes: TEST_RESTAURANT_LIKES
        });

        restaurantId = restaurant.id;

        expect(restaurant.name).toEqual(generatedJwtSecret);
        expect(restaurant.type).toEqual(TEST_RESTAURANT_TYPE);
        expect(restaurant.address).toEqual(TEST_RESTAURANT_ADDRESS);
        expect(restaurant.previewLink).toMatch(generatedJwtSecret);
        expect(restaurant.likes).toEqual(TEST_RESTAURANT_LIKES);
    });

    it('update and find one', async () => {
        await RestaurantService.update({
            id: restaurantId,
            name: generatedJwtSecret + 1,
            type: TEST_RESTAURANT_TYPE + 1,
            address: TEST_RESTAURANT_ADDRESS + 1,
            likes: TEST_RESTAURANT_LIKES + 1
        });

        const restaurant = await RestaurantService.findOne(restaurantId);

        expect(restaurant?.name).toEqual(generatedJwtSecret + 1);
        expect(restaurant?.type).toEqual(TEST_RESTAURANT_TYPE + 1);
        expect(restaurant?.address).toEqual(TEST_RESTAURANT_ADDRESS + 1);
        expect(restaurant?.likes).toEqual(TEST_RESTAURANT_LIKES + 1);
    });

    it('find all', async () => {
        const [restaurant] = await RestaurantService.findAll(undefined);

        expect(restaurant.name).toEqual(generatedJwtSecret + 1);
        expect(restaurant.type).toEqual(TEST_RESTAURANT_TYPE + 1);
        expect(restaurant.address).toEqual(TEST_RESTAURANT_ADDRESS + 1);
        expect(restaurant.previewLink).toMatch(generatedJwtSecret);
        expect(restaurant.likes).toEqual(TEST_RESTAURANT_LIKES + 1);
    });

    it('delete', async () => {
        const [restaurant] = await RestaurantService.findAll(undefined);

        expect(restaurant).not.toBeUndefined();

        await RestaurantService.delete(restaurant.id);

        const [restaurantAfterDelete] = await RestaurantService.findAll(undefined);

        expect(restaurantAfterDelete).toBeUndefined();
    });

    afterAll(async () => await clearDB());
});
