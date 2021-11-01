import StatusCodes from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import { JwtService } from '@shared/JwtService';
import { cookieProps } from '../types';


const jwtService = new JwtService();
const { UNAUTHORIZED } = StatusCodes;

export const authMW = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get json-web-token
        const jwt = req.signedCookies[cookieProps.key];
        if (!jwt) {
            throw Error('JWT not present in signed cookie.');
        }
        // verify jwt
        const clientData = await jwtService.decodeJwt(jwt);

        if (!clientData) {
            throw Error('JSON-web-token validation failed.');
        }
        next();
        console.log(clientData)
    } catch (err) {
        return res.status(UNAUTHORIZED).json({
            error: err.message,
        });
    }
};
