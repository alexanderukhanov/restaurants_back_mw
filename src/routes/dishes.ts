import { Request, Response } from 'express';
import DishService from '../services/dish.service'
import { deleteFileFromStorage } from '../helpers/deleteFileFromStorage';
import StatusCodes from 'http-status-codes';
import { deleteDishValidation, updateDishValidation } from '../validations/dishValidation';
import { UpdateDishRequest } from '../types';
const { NOT_FOUND, OK } = StatusCodes;

export async function deleteDish(req: Request, res: Response) {
    const { id } = req.params;
    const { error } = deleteDishValidation(id);

    if (error) {
        return res.status(400).json(error.message).end();
    }

    const dish = await DishService.findOne(Number(id));

    if (!dish) {
        return res.status(NOT_FOUND).end();
    }

    deleteFileFromStorage(dish.previewLink);
    await DishService.delete(dish.id);

    return res.status(OK).end();
}

export async function updateDish(req: UpdateDishRequest, res: Response) {
    const { id } = req.body;
    const { error } = updateDishValidation(req.body);

    if (error) {
        return res.status(400).json(error.message).end();
    }

    const dish = await DishService.findOne(id);

    if (!dish) {
        res.status(NOT_FOUND).end();
    }

    await DishService.update(req);

    return res.status(OK).end();
}
