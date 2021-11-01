import { DataTypes, Model } from 'sequelize';
import Sequelize from 'sequelize/types/lib/sequelize';

export interface DishAttributes {
    id: number,
    name: string,
    description: string,
    previewLink: string,
    cost: number,
    restaurantId: number,
}

export interface DishCreationAttributes extends Omit<DishAttributes, 'id'> {}

export interface DishInstance extends Model<
    DishAttributes, DishCreationAttributes
>, DishAttributes {}

export const initDish = (sequelize: Sequelize) => (
    sequelize.define<DishInstance, DishAttributes>('Dish', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        previewLink: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        restaurantId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {})
)
