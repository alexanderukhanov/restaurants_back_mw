import { addRestaurantForTest, clearDB, loginAsUser } from "../index";
import RestaurantService from "../../src/services/restaurant.service";
import OrderService from "../../src/services/order.service";
import { TEST_EMAIL, TEST_TOTAL_COST } from "../../src/constants";
import UserService from "../../src/services/user.service";
import { initDishInOrder } from "../../src/db/models/dishInOrder.model";

const DishInOrder = module.require('../../src/db/models').DishInOrder as ReturnType<typeof initDishInOrder>;

describe('order service', () => {
    let restaurantId: number;
    let userId: number;
    let orderId: number;

    beforeAll(async () => {
        await clearDB();
        await addRestaurantForTest();
        await loginAsUser();
    });

    it('add order and corresponding dishes', async () => {
        const [restaurant] = await RestaurantService.findAll(undefined);
        const user = await UserService.findOneByEmail(TEST_EMAIL);
        user && (userId = user.id);
        restaurantId = restaurant.id;

        expect(restaurant.Dishes.length).toEqual(2);

        const result = await OrderService.add({
            restaurantId,
            userId,
            dishIDs: restaurant.Dishes.map(({id}) => id),
            totalCost: TEST_TOTAL_COST
        });

        orderId = result.id;

        await DishInOrder.bulkCreate(restaurant.Dishes.map(({cost, id}) => ({
            dishId: id,
            amount: Number(cost),
            orderId,
        })));

        const dishes = await DishInOrder.findAll();

        expect(result.restaurantId).toEqual(restaurantId);
        expect(result.userId).toEqual(userId);
        expect(result.totalCost).toEqual(TEST_TOTAL_COST);

        expect(dishes.length).toEqual(2);
        expect(dishes[0].dishId).toEqual(restaurant.Dishes[0].id);
        expect(dishes[0].orderId).toEqual(orderId);
        expect(dishes[0].amount).toEqual(Number(restaurant.Dishes[0].cost));
        expect(dishes[1].dishId).toEqual(restaurant.Dishes[1].id);
        expect(dishes[1].orderId).toEqual(orderId);
        expect(dishes[1].amount).toEqual(Number(restaurant.Dishes[1].cost));
    });

    it('findAll, findOne', async () => {
        const [findAllResult] = await OrderService.findAll();

        expect(findAllResult.id).toEqual(orderId);
        expect(findAllResult.restaurantId).toEqual(restaurantId);
        expect(findAllResult.userId).toEqual(userId);
        expect(findAllResult.totalCost).toEqual(TEST_TOTAL_COST);

        const findOneResult = await OrderService.findOne(orderId);

        expect(findOneResult?.restaurantId).toEqual(restaurantId);
        expect(findOneResult?.userId).toEqual(userId);
        expect(findOneResult?.totalCost).toEqual(TEST_TOTAL_COST);
    });

    afterAll(async () => await clearDB());
});
