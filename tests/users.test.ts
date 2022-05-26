import request from 'supertest';

import app from "../src/Server";
import UserService from "../src/services/user.service";
import { TEST_EMAIL, TEST_PASSWORD } from "../src/constants";
import { clearDB, loginAsUser } from "./index";

describe('Users', () => {
    beforeAll(async () => await clearDB());

    it('get profile', async () => {
        const res = await loginAsUser();

        const user = await UserService.findOneByEmail(TEST_EMAIL);

        const result = await request(app)
            .get('/api/users/profile')
            .set('Cookie', res.headers['set-cookie']);

        const { id, email, role } = user || {};

        expect(result.body.id).toEqual(id);
        expect(result.body.email).toEqual(email);
        expect(result.body.role).toEqual(role);
    });

    afterAll(async () => await clearDB());
})
