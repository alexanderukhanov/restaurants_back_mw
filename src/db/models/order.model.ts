import { DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize/types/lib/sequelize';
import { DishInstance } from './dish.model';

export interface OrderAttributes {
    id: number,
    userId: number,
    restaurantId: number,
    totalCost: number,
    isPaid: boolean,
    Dishes?: {
        id: number
    }[]
}

export interface OrderCreationAttributes extends Omit<OrderAttributes, 'id' | 'isPaid'> {}

export interface OrderInstance extends Model<
    OrderAttributes, OrderCreationAttributes
>, OrderAttributes {
    addDish(dishes: DishInstance[]): Promise<void>;
}

export const initOrder = (sequelize: Sequelize) => (
    sequelize.define<OrderInstance, OrderAttributes>('Order', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        restaurantId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        totalCost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isPaid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    })
)
