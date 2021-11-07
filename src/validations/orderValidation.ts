import { CreateOrderRequest } from '../types';
import Joi from 'joi';

export const createOrderValidation = (data: CreateOrderRequest['body']) => (
    Joi.object<CreateOrderRequest['body']>({
        userId: Joi.number().required(),
        totalCost: Joi.string().required(),
        restaurantId: Joi.number().required(),
        dishIDs: Joi.array().items(Joi.number()).required()
    }).validate(data)
)

export const deleteOrderValidation = (id: string) => (
    Joi.custom(() => {
        if (isNaN(Number(id))) {
            throw new Error('param must be a number')
        }
    }).required().validate(id)
)
