import { DataTypes, Model } from 'sequelize';
import Sequelize from 'sequelize/types/lib/sequelize';

export interface UserLikesAttributes {
    userId: number,
    restaurantId: number,
}

export interface UserLikesInstance extends Model<
    UserLikesAttributes, UserLikesAttributes
    >, UserLikesAttributes {}

export const initUserLikes = (sequelize: Sequelize) => (
    sequelize.define<UserLikesInstance, UserLikesAttributes>('UserLikes', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        restaurantId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {timestamps: false})
)
