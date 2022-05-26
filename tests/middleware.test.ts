import { jest } from "@jest/globals";
import { Request, Response } from "express";
import { authMiddleWare, spamMiddleWare } from "../src/routes/middleware";
import { cookieProps } from "../src/types";
import { JwtService } from "../src/helpers/JwtService"
import { TEST_USER_ID, TEST_USER_ROLE } from "../src/constants";

describe('Middleware', () => {
    let json: string;
    let statusCode: number;
    const mockRequest = { signedCookies: {} } as Request;
    const mockResponse = {
        locals: {},
        send: function(){},
        end: function(){},
        json: function(message) {
            json = message.error;
        },
        status: function(code) {
            statusCode = code;
            return this;
        }
    } as Response;
    const nextFunction = jest.fn();

    it('without cookie', async () => {
        await authMiddleWare(mockRequest, mockResponse, nextFunction);

        expect(statusCode).toEqual(401);
        expect(json).toBe('JWT not present in signed cookie.');
    });

    it('with cookie and wrong jwt', async () => {
        mockRequest.signedCookies[cookieProps.key] = 'wrong jwt';
        await authMiddleWare(mockRequest, mockResponse, nextFunction);

        expect(statusCode).toEqual(401);
        expect(json).toBe('JSON-web-token validation failed.');
    });

    it('with cookie and jwt', async () => {
        const jwtService = new JwtService();

        mockRequest.signedCookies[cookieProps.key] = await jwtService.getJwt({
            id: TEST_USER_ID,
            role: TEST_USER_ROLE,
        });

        await authMiddleWare(mockRequest, mockResponse, nextFunction);

        expect(mockResponse.locals.user).toBeTruthy();
        expect(mockResponse.locals.user.id).toBe(TEST_USER_ID);
        expect(mockResponse.locals.user.role).toBe(TEST_USER_ROLE);
        expect(nextFunction).toHaveBeenCalledTimes(1);
    });

    it('spam middleware works', async () => {
        for (const mock of new Array(502)) {
            await spamMiddleWare(mockRequest, mockResponse, nextFunction);
        }

        expect(statusCode).toEqual(403);
        expect(nextFunction).toHaveBeenCalledTimes(501);
    });
})
