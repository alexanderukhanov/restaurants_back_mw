import request from 'supertest';
import app from "../src/Server";

import {
    ADMIN_EMAIL,
    TEST_ADMIN_ROLE,
    TEST_EMAIL,
    TEST_PASSWORD
} from "../src/constants";
import UserService from "../src/services/user.service";
import { clearDB, loginAsAdmin, loginAsUser } from "./index";

describe('Auth', () => {
    beforeAll(async () => await clearDB());

    it('user registration works', async () => {
        const res = await loginAsUser();

        const [ExpressGeneratorTsCookie] = res.headers['set-cookie'];
        const [jwtFromCookie] = ExpressGeneratorTsCookie.split('=')[1].split(';');

        const user = await UserService.findOneByEmail(TEST_EMAIL);

        expect(jwtFromCookie).toBeTruthy();
        expect(res.statusCode).toEqual(200);
        expect(user).not.toBe(null);
    });

    it('admin registration works', async () => {
        const res = await loginAsAdmin();

        const [ExpressGeneratorTsCookie] = res.headers['set-cookie'];
        const [jwtFromCookie] = ExpressGeneratorTsCookie.split('=')[1].split(';');

        const user = await UserService.findOneByEmail(ADMIN_EMAIL);

        expect(jwtFromCookie).toBeTruthy();
        expect(res.statusCode).toEqual(200);
        expect(user).not.toBe(null);
        expect(user && user.role).toBe(TEST_ADMIN_ROLE);
    });

    it('user login works', async () => {
        const res = await loginAsUser();

        const [ExpressGeneratorTsCookie] = res.headers['set-cookie'];
        const [jwtFromCookie] = ExpressGeneratorTsCookie.split('=')[1].split(';');

        expect(jwtFromCookie).toBeTruthy();
        expect(res.statusCode).toEqual(200);
    });

    it('admin login works', async () => {
        const res = await loginAsAdmin();

        const [ExpressGeneratorTsCookie] = res.headers['set-cookie'];
        const [jwtFromCookie] = ExpressGeneratorTsCookie.split('=')[1].split(';');

        expect(jwtFromCookie).toBeTruthy();
        expect(res.statusCode).toEqual(200);
    });

    it('logout works', async () => {
        const res = await request(app)
            .get('/api/auth/logout')

        expect(res.statusCode).toEqual(200);
        expect(res.headers['set-cookie'][0]).toMatch('Max-Age=-1');
    });

    afterAll(async () => await clearDB());
})
