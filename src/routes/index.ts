import { Router } from 'express';
import { authMW } from './middleware';
import { login, logout } from './Auth';
import {
    addRestaurant,
    deleteRestaurant,
    getAllRestaurants,
    updateRestaurant
} from './Restaurants';
import { getImage } from './Images';
import { deleteDish, updateDish } from './Dishes';
import { addOrder, deleteOrder } from './Orders';

// Auth router
const authRouter = Router();
authRouter.post('/login', login);
authRouter.get('/logout', logout);

//Restaurant router
const restaurantRouter = Router();
restaurantRouter.get('/all', getAllRestaurants);
restaurantRouter.post('/add', addRestaurant);
restaurantRouter.put('/update', updateRestaurant);
restaurantRouter.delete('/:id', deleteRestaurant);

// Image-router
const imageRouter = Router();
imageRouter.get('/:name', getImage)

// Dish-router
const dishRouter = Router();
dishRouter.put('/update', updateDish)
dishRouter.delete('/:id', deleteDish)

// Order-router
const orderRouter = Router();
orderRouter.post('/add', addOrder)
orderRouter.delete('/:id', deleteOrder)

// Export the base-router
const baseRouter = Router();
baseRouter.use('/auth', authRouter);
baseRouter.use('/restaurants', authMW, restaurantRouter);
baseRouter.use('/dishes', authMW, dishRouter);
baseRouter.use('/images', authMW, imageRouter);
baseRouter.use('/orders', authMW, orderRouter);

export default baseRouter;
