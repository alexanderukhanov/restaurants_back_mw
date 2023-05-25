import { QueryTypes } from 'sequelize';

import {
    RestaurantAttributes,
    RestaurantCreationAttributes,
    initRestaurant,
    RestaurantInstance,
} from '../db/models/restaurant.model';
import { initDish } from '../db/models/dish.model';
import { sequelize } from "../db/models";

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

    public update(body : UpdateRestaurantRequest['body']) {
        return Restaurant.update(body, { where: { id: body.id } } )
    }

    public findOne(id: RestaurantAttributes['id']) {
        return Restaurant.findOne({ where: { id }})
    }

    public async findAll(userId: number | undefined) {
        const restaurants: Array<RestaurantInstance & {isLiked: number}> = await sequelize.query(`
             select r.*, if (ul.restaurantId is not null, 1, 0) as isLiked
             from Restaurants r
             left join UserLikes ul on ul.userId = ?
             and ul.restaurantId = r.id
             order by r.id asc`,
            {replacements: [userId], type: QueryTypes.SELECT}
        );
        const dishes = await Dish.findAll();

        return restaurants.map(restaurant => ({
            ...restaurant,
            Dishes: dishes.filter(dish => dish.restaurantId === restaurant.id)
        }));
    }

    public delete(id: RestaurantAttributes['id']) {
        return Restaurant.destroy({ where: { id } })
    }
}

export default new RestaurantService();
