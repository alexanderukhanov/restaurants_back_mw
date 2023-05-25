import { initOrder, OrderAttributes } from '../db/models/order.model';
import { CreateOrder } from '../types';

const Order = module.require('../db/models').Order as ReturnType<typeof initOrder>;

class OrderService {
    public async add({ restaurantId, userId, totalCost, dishIDs }: CreateOrder['body']) {
        // logic for 1 dish to 1 order (not using now)
        // const dishes = await DishService.findByIDs(dishIDs);

        const order = await Order.create({
            restaurantId,
            totalCost,
            userId,
        });
        // logic for 1 dish to 1 order (not using now)
        // await order.addDish(dishes)

        return order;
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
