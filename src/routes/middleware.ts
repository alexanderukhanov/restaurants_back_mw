import StatusCodes from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../helpers/JwtService';
import { cookieProps } from '../types';

const jwtService = new JwtService();
const { UNAUTHORIZED, FORBIDDEN } = StatusCodes;

export const authMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
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

        res.locals.user = clientData
        next();
    } catch (err) {
        return res.status(UNAUTHORIZED).json({
            error: err.message || err,
        });
    }
};

const ips = new Map;
const limit = 500;

const timer = setInterval(() => ips.clear(), 60000);

export const spamMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
    const count = ips.get(req.ip) || 0;
    if (count < limit) {
        // parse jwt for like functionality
        const jwt = req.signedCookies[cookieProps.key];

        // in order to see active like for unprotected getAllRestaurants
        const isGetAllRestaurants = req.originalUrl === '/api/restaurants/all';
        if (jwt && isGetAllRestaurants && !res.locals?.user) {
            const clientData = await jwtService.decodeJwt(jwt);

            if (clientData) {
                res.locals.user = clientData;
            }
        }

        ips.set(req.ip, count +1);
        next();
    } else {
        return res.status(FORBIDDEN).end();
    }
}

timer.unref();
