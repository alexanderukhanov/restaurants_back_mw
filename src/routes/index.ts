import { Router } from 'express';
import { authMiddleWare, spamMiddleWare } from './middleware';
import { login, logout } from './Auth';
import {
    addRestaurant,
    deleteRestaurant,
    getAllRestaurants,
    updateRestaurant,
    updateRestaurantLike,
} from './Restaurants';
import { getImage } from './Images';
import { deleteDish, updateDish } from './Dishes';
import { addOrder, deleteOrder } from './Orders';
import { getProfile } from './Users';

// Auth router
const authRouter = Router();
authRouter.post('/login', login);
authRouter.get('/logout', logout);

//User router
const userRouter = Router();
userRouter.get('/profile', getProfile);

//Restaurant router
const restaurantRouter = Router();
restaurantRouter.get('/all', spamMiddleWare, getAllRestaurants);
restaurantRouter.post('/add', authMiddleWare, addRestaurant);
restaurantRouter.put('/update', authMiddleWare, updateRestaurant);
restaurantRouter.put('/likeRestaurant', authMiddleWare, spamMiddleWare, updateRestaurantLike);
restaurantRouter.delete('/:id', authMiddleWare, deleteRestaurant);

// Image-router
const imageRouter = Router();
imageRouter.get('/:name', getImage);

// Dish-router
const dishRouter = Router();
dishRouter.put('/update', updateDish);
dishRouter.delete('/:id', deleteDish);

// Order-router
const orderRouter = Router();
orderRouter.post('/add', addOrder);
orderRouter.delete('/:id', deleteOrder);

// Export the base-router
const baseRouter = Router();
baseRouter.use('/auth', authRouter);
baseRouter.use('/users',authMiddleWare, userRouter);
baseRouter.use('/restaurants', restaurantRouter);
baseRouter.use('/dishes', authMiddleWare, dishRouter);
baseRouter.use('/images', spamMiddleWare, imageRouter);
baseRouter.use('/orders', authMiddleWare, orderRouter);

export default baseRouter;
