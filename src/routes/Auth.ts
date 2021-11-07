import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import { JwtService } from '@shared/JwtService';
import UserService from '../services/user.service';
import { createUserValidation } from '../validations/userValidation';
import { cookieProps, CreateUserRequest } from '../types';

const jwtService = new JwtService();
const { OK, UNAUTHORIZED } = StatusCodes;

export async function login(req: CreateUserRequest, res: Response) {
    const { email, password } = req.body;

    const { error } = createUserValidation(req.body)
    if (error) {
        return res.status(400).json(error.message)
    }

    let user = await UserService.findOneByEmail(email);

    if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10)
        const role = email === 'admin@mail.com' && password === 'admin123' ? 'admin' : 'user' ;

        user = await UserService.createUser({ email, password: hashedPassword, role })
    }

    // Check password
    const pwdPassed =  bcrypt.compareSync(password, user.password);

    if (!pwdPassed) {
        return res.status(UNAUTHORIZED).json({
            error: 'loginFailedErr',
        });
    }

    // Setup Cookie
    const jwt = await jwtService.getJwt({
        id: user.id,
        role: user.role,
    });
    const { key, options } = cookieProps;
    res.cookie(key, jwt, options);

    return res.status(OK).end();
}

export function logout(req: Request, res: Response) {
    const { key, options } = cookieProps;
    res.clearCookie(key, {...options, maxAge: -1});
    return res.status(OK).end();
}


// TODO при удалении модалка в виде компонента, при успешном создании уведомление, мб тоже модалка + очистка всех полей и дефолтный вид.
//  react Context попробовать
//  главная страница - стянуть рестораны + блюда, сохранить в стор,
//  отобразить все рестораны в виде карточек => по клику на карточку список блюд этого ресторана
//  лайк ресторана
//  notifier об ошибках
//  выделять галочками блюда и отображать счетчик корзины
//  в корзине возможность выбрать доп опции (либо в меню ресторана) + подсчет общей стоимости
//  mock оплаты
//  занесение заказа в БД
