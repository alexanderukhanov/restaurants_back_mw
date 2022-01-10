import { Request, Response } from 'express';
import OrderService from '../services/order.service'
import StatusCodes from 'http-status-codes';
import { CreateOrderRequest } from '../types';
import { createOrderValidation, deleteOrderValidation } from '../validations/orderValidation';
import DishService from '../services/dish.service';
import RestaurantService from '../services/restaurant.service';
import UserService from '../services/user.service';
import { initDishInOrder } from '../db/models/dishInOrder.model';
const { NOT_FOUND, CREATED, OK, PAYMENT_REQUIRED } = StatusCodes;

const DishInOrder = module.require('../db/models').DishInOrder as ReturnType<typeof initDishInOrder>

export async function addOrder(req: CreateOrderRequest, res: Response) {
    const userId: number = res.locals.user.id;
    const { restaurantId, dishes, totalCost } = req.body;
    const { error } = createOrderValidation(req.body);

    if (error) {
        return res.status(400).json(error.message).end();
    }

    const verifiedDishes = await DishService.findByIDs(dishes.map(dish => dish.id));
    const unfoundedDishes = dishes
        .filter(({ id }) => !verifiedDishes.some(dish => dish.id === id));

    if (unfoundedDishes.length) {
        return res.status(NOT_FOUND).json(`Dish with name '${unfoundedDishes[0].name}' not found!`);
    }

    const verifiedDishesWithAmount = verifiedDishes.map(({id, cost}) => ({
        id,
        cost,
        amount: dishes.find(dishFromRequest => dishFromRequest.id === id)?.amount || 1
    }));

    const calculatedTotalCost = verifiedDishesWithAmount
        .reduce((acc, {cost, amount}) => (acc + (Number(cost) * amount)), 0);

    if (calculatedTotalCost !== Number(totalCost)) {
        return res.status(PAYMENT_REQUIRED).json(`The total cost isn't correct`);
    }

    const restaurant = await RestaurantService.findOne(restaurantId);
    const user = await UserService.findOne(userId);

    if (!verifiedDishes.length || !restaurant || !user) {
        return res.status(NOT_FOUND).end();
    }

    const order = await OrderService.add({restaurantId, totalCost, userId, dishIDs: []});
    const dishToInsert = verifiedDishesWithAmount.map(({id, amount}) => ({
        amount,
        dishId: id,
        orderId: order.id,
    }));

    await DishInOrder.bulkCreate(dishToInsert);

    return res.status(CREATED).end();
}

export async function deleteOrder(req: Request, res: Response) {
    const { id } = req.params;
    const { error } = deleteOrderValidation(id);

    if (error) {
        return res.status(400).json(error.message).end();
    }

    const order = await OrderService.findOne(Number(id));

    if (!order) {
        return res.status(NOT_FOUND).end();
    }

    await OrderService.delete(order.id);

    return res.status(OK).end();
}
