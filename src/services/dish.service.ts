import { DishAttributes, initDish } from '../db/models/dish.model';
import { saveFileFromBase64 } from '../helpers/saveFileFromBase64';
import { CreateDish, UpdateDishRequest } from '../types';

const Dish = module.require('../db/models').Dish as ReturnType<typeof initDish>;

class DishService {
    public async add({
            dishes,
            restaurantId,
        }: CreateDish) {
        const dishesToInsert = await Promise.all(dishes.map(async (dish) => ({
                ...dish,
                previewLink: await saveFileFromBase64(dish.previewLink, dish.name),
                restaurantId,
            }))
        );

        return Dish.bulkCreate(dishesToInsert)
    }

    public update({ body }: UpdateDishRequest) {
        return Dish.update({ ...body }, { where: { id: body.id } })
    }

    public find(restaurantId: DishAttributes['id']) {
        return Dish.findAll({ where: { restaurantId } })
    }

    public findByIDs(IDs: Array<DishAttributes['id']>) {
        return Dish.findAll({ where: { id: IDs } })
    }

    public findOne(id: DishAttributes['id']) {
        return Dish.findOne({ where: { id } })
    }

    public delete(id: DishAttributes['id']) {
       return Dish.destroy({ where: { id } })
    }
}

export default new DishService();
