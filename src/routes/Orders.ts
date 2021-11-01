import { Request, Response } from 'express';
import OrderService from '../services/order.service'
import StatusCodes from 'http-status-codes';
import { CreateOrderRequest } from '../types';
import { createOrderValidation, deleteOrderValidation } from '../validations/orderValidation';
import DishService from '../services/dish.service';
import RestaurantService from '../services/restaurant.service';
import UserService from '../services/user.service';
const { NOT_FOUND, CREATED, OK } = StatusCodes;

export async function addOrder(req: CreateOrderRequest, res: Response) {
    const { userId, restaurantId, dishIDs } = req.body;
    const { error } = createOrderValidation(req.body);
    if (error) {
        return res.status(400).json(error.message).end();
    }

    const dishes = await DishService.findByIDs(dishIDs);
    const restaurant = await RestaurantService.findOne(restaurantId);
    const user = await UserService.findOne(userId)

    if (!dishes.length || !restaurant || !user) {
        return res.status(NOT_FOUND).end();
    }

    await OrderService.add(req.body);

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

    await OrderService.delete(order.id)

    return res.status(OK).end();
}
