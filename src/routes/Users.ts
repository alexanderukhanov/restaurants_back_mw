import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from '../services/user.service';
const { NOT_FOUND, OK } = StatusCodes;

export async function getProfile(req: Request, res: Response) {
    const userId: number = res.locals.user.id;
    const userProfile = await UserService.findOne(userId);

    if (!userProfile) {
        return res.status(NOT_FOUND).end();
    }

    return res.status(OK).json(userProfile).end();
}
