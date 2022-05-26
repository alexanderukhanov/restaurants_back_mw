import { addRestaurantForTest, clearDB } from "../index";
import RestaurantService from "../../src/services/restaurant.service";
import DishService from "../../src/services/dish.service";
import {
    TEST_DISH0_COST,
    TEST_DISH0_DESCRIPTION,
    TEST_DISH0_NAME,
    TEST_IMAGE_BASE64
} from "../../src/constants";

describe('dish service', () => {
    let restaurantId: number;

    beforeAll(async () => {
        await clearDB();
        await addRestaurantForTest();
        const [restaurant] = await RestaurantService.findAll(undefined);

        expect(restaurant.Dishes.length).toEqual(2);
        restaurantId = restaurant.id;
    });

    it('add dish', async () => {
        await DishService.add({
            restaurantId,
            dishes: [{
                name: TEST_DISH0_NAME,
                cost: TEST_DISH0_COST,
                description: TEST_DISH0_DESCRIPTION,
                previewLink: TEST_IMAGE_BASE64
            }]
        });

        const [restaurant] = await RestaurantService.findAll(undefined);

        expect(restaurant.Dishes.length).toEqual(3);
    });

    it('update dish', async () => {
        const [restaurant] = await RestaurantService.findAll(undefined);
        const dishId = restaurant.Dishes[2].id;

        await DishService.update({
            body: {
                id: dishId,
                name: TEST_DISH0_NAME + 1
            }
        });

        const [restaurantAfterUpdate] = await RestaurantService.findAll(undefined);

        expect(restaurantAfterUpdate.Dishes[2].name).toEqual(TEST_DISH0_NAME + 1);
    });

    it('find, findByIDs, findOne', async () => {
        const findResult = await DishService.find(restaurantId);

        expect(findResult.length).toEqual(3);

        const findByIDsResult = await DishService.findByIDs(findResult.map(({id}) => id));

        expect(findByIDsResult.length).toEqual(3);

        const findOneResult = await DishService.findOne(findByIDsResult[2].id);

        expect(findOneResult && findOneResult.name).toEqual(TEST_DISH0_NAME + 1);
    });

    it('delete dish', async () => {
        const dishes = await DishService.find(restaurantId);

        expect(dishes.length).toEqual(3);

        await DishService.delete(dishes[2].id);

        const dishesAfterDelete = await DishService.find(restaurantId);

        expect(dishesAfterDelete.length).toEqual(2);
    });

    afterAll(async () => await clearDB());
});
