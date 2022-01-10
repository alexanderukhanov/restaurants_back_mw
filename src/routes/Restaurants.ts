import { Request, Response } from 'express';
import RestaurantService from '../services/restaurant.service'
import DishService from '../services/dish.service'
import StatusCodes from 'http-status-codes';
import { deleteFileFromStorage } from '../helpers/deleteFileFromStorage';
import { CreateRestaurantRequest, UpdateRestaurantRequest } from '../types';
import {
    createRestaurantValidation,
    deleteRestaurantValidation,
    updateRestaurantValidation
} from '../validations/restaurantValidation';
import { createDishArrayValidation } from '../validations/dishValidation';

import { initUserLikes } from '../db/models/userLikes.model';
const UserLikes = module.require('../db/models').UserLikes as ReturnType<typeof initUserLikes>;
const { NOT_FOUND, CREATED, OK } = StatusCodes;

export async function addRestaurant(req: CreateRestaurantRequest, res: Response) {
    const { restaurant, dishes } = req.body;
    const { error } = createRestaurantValidation(req.body.restaurant);

    if (error) {
        return res.status(400).json(error.message).end();
    }

    const createdRestaurant = await RestaurantService.add(restaurant);

    if (!dishes) {
        return res.status(CREATED).end();
    }

    const { error: dishValidationError } = createDishArrayValidation(dishes);

    if (dishValidationError) {
        return res.status(400).json(dishValidationError.message).end();
    }

    await DishService.add({
        dishes,
        restaurantId: createdRestaurant.id,
    });

    return res.status(CREATED).end();
}

export async function updateRestaurant(req: UpdateRestaurantRequest, res: Response) {
    const { id } = req.body;
    const { error } = updateRestaurantValidation(req.body);

    if (error) {
        return res.status(400).json(error.message).end();
    }

    const restaurant = await RestaurantService.findOne(id);

    if (!restaurant) {
        return res.status(NOT_FOUND).end();
    }

    await RestaurantService.update(req.body);

    return res.status(OK).end();
}

export async function updateRestaurantLike(req: UpdateRestaurantRequest, res: Response) {
    const { id } = req.body;
    const userId: number = res.locals.user.id;
    const { error } = updateRestaurantValidation(req.body);

    if (error) {
        return res.status(400).json(error.message).end();
    }

    const restaurant = await RestaurantService.findOne(id);

    if (!restaurant) {
        return res.status(NOT_FOUND).end();
    }

    const userLikes = await UserLikes.findOne({where:{userId, restaurantId: id}});

    if (!userLikes) {
        await RestaurantService.update({
            ...req.body,
            likes: restaurant.likes + 1,
        });

        await UserLikes.create({userId, restaurantId: id});

        return res.status(OK).end();
    } else {
        await RestaurantService.update({
            ...req.body,
            likes: restaurant.likes - 1,
        });

        await UserLikes.destroy({where: {userId, restaurantId: id}});

        return res.status(OK).end();
    }
}

export async function deleteRestaurant(req: Request, res: Response) {
    const { id } = req.params;
    const { error } = deleteRestaurantValidation(id);

    if (error) {
        return res.status(400).json(error.message).end();
    }

    const restaurant = await RestaurantService.findOne(Number(id));

    if (!restaurant) {
        return res.status(NOT_FOUND).end();
    }

    deleteFileFromStorage(restaurant.previewLink);

    const dishArr = await DishService.find(restaurant.id);
    dishArr.forEach((dish) => (
        deleteFileFromStorage(dish.previewLink)
    ));

    await RestaurantService.delete(restaurant.id);

    return res.status(OK).end();
}

export async function getAllRestaurants(req: Request, res: Response) {
    const userId: number | undefined = res.locals?.user?.id;
    const restaurants = await RestaurantService.findAll(userId);

    return res.status(OK).json(restaurants);
}
