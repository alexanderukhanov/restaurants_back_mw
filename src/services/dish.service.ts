import { DishAttributes, DishCreationAttributes, initDish } from '../db/models/dish.model';
import { saveFileFromBase64 } from '../helpers/saveFileFromBase64';
import { UpdateDishRequest } from '../types';

const Dish = module.require('../db/models').Dish as ReturnType<typeof initDish>;


class DishService {
    public async add({
            name,
            description,
            previewLink,
            restaurantId,
            cost,
        }: DishCreationAttributes) {
        return Dish.create({
            name,
            description,
            previewLink: await saveFileFromBase64(previewLink, name),
            cost,
            restaurantId,
        })
    }

    public update({ body }: UpdateDishRequest) {
        return Dish.update({ ...body }, { where: { id: body.id } })
    }

    public find(restaurantId: DishAttributes['restaurantId']) {
        return Dish.findAll({ where: { restaurantId } })
    }

    public findByIDs(IDs: Array<DishAttributes['restaurantId']>) {
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
