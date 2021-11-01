import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import { JwtService } from '@shared/JwtService';
import UserService from '../services/user.service';
import { createUserValidation } from '../validations/userValidation';
import { cookieProps } from '../types';

const jwtService = new JwtService();
const { OK, UNAUTHORIZED } = StatusCodes;

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    const { error } = createUserValidation(req.body)
    if (error) {
        return res.status(400).json(error.message)
    }

    let user = await UserService.findOneByEmail(email);

    if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10)
        const role = email === 'admin@mail.com' && password === 'admin' ? 'admin' : 'user' ;

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
    res.clearCookie(key, options);
    return res.status(OK).end();
}

// TODO FRONT: get profile after refresh for userRole and mb id. And set to reducer

// TODO 2 таблицы рестораны(все параметры ресторанов) и блюда(все параметры блюд) - и связать их.
//  Добавляя ресторан - вносить блюда, которые прилетают вместе с рестораном.
//  Ну и чекнуть получение ресторана со связанными блюдами
