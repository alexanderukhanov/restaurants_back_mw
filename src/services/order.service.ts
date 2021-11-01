import { initOrder, OrderAttributes } from '../db/models/order.model';
import DishService from '../services/dish.service'
import { CreateOrderRequest } from '../types';
import { deleteOrderValidation } from '../validations/orderValidation';

const Order = module.require('../db/models').Order as ReturnType<typeof initOrder>;

class OrderService {
    public async add({ restaurantId, userId, totalCost, dishIDs }: CreateOrderRequest['body']) {
        const dishes = await DishService.findByIDs(dishIDs);

        const order = await Order.create({
            restaurantId,
            totalCost,
            userId,
        })

        await order.addDish(dishes)
    }

    public findAll() {
        return Order.findAll();
    }

    public findOne(id: OrderAttributes['id']) {
        return Order.findOne({ where: { id } });
    }

    public async delete(id: OrderAttributes['id']) {
        return Order.destroy({ where: { id } })
    }
}

export default new OrderService()
