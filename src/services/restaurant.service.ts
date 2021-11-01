import {
    RestaurantAttributes,
    RestaurantCreationAttributes,
    initRestaurant
} from '../db/models/restaurant.model';
import { initDish } from '../db/models/dish.model';

import { saveFileFromBase64 } from '../helpers/saveFileFromBase64';
import { UpdateRestaurantRequest } from '../types';

const Restaurant = module.require('../db/models').Restaurant as ReturnType<typeof initRestaurant>;
const Dish = module.require('../db/models').Dish as ReturnType<typeof initDish>;

class RestaurantService {
    public async add({ name, address, type, previewLink, likes }: RestaurantCreationAttributes) {
        return Restaurant.create({
            type,
            address,
            name,
            previewLink: await saveFileFromBase64(previewLink, name),
            likes,
        }, {})
    }

    public update({ body }: UpdateRestaurantRequest) {
        return Restaurant.update({ ...body }, { where: { id: body.id } } )
    }

    public findOne(id: RestaurantAttributes['id']) {
        return Restaurant.findOne({ where: { id }})
    }

    public findAll() {
        return Restaurant.findAll({ include: Dish })
    }

    public delete(id: RestaurantAttributes['id']) {
        return Restaurant.destroy({ where: { id } })
    }

}

export default new RestaurantService();
