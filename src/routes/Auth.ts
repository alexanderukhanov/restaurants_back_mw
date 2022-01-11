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
    const { error } = createUserValidation(req.body);

    if (error) {
        return res.status(400).json(error.message);
    }

    let user = await UserService.findOneByEmail(email);

    if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = email === 'admin@mail.com' && password === 'admin123' ? 'admin' : 'user' ;

        user = await UserService.createUser({ email, password: hashedPassword, role });
    }

    // Check password
    const pwdPassed =  bcrypt.compareSync(password, user.password);

    if (!pwdPassed) {
        return res.status(UNAUTHORIZED).json({
            error: 'Wrong password',
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



// TODO сдеално в проекте:
//  антиспам middleware
//  авторизация/защита на cookie в которых летает JWT
//  log out: очистка cookie и протухание JWT
//  сохранение изображений, конвентируя их base64 в jpg и сохранение в директории проекта
//  эндпоинт отдачи изображений с использованием createReadStream
//  sequelize полностью на TS ( и модели и методы и подсказки - чего нет внятно в доке )
//  валидация запросов, информативные exceptions
//  занесение заказа в БД
//  корзина: подсчет цен блюд, удаление добавление (фронт)
//  нотификация об ошибках / успехах (фронт)
//  реализация лайков ( фронт бек )
//  проект можно развернуть с помощью одного .yml файла и одной команды на любом linux
