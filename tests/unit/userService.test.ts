import { clearDB } from "../index";
import UserService from "../../src/services/user.service";
import { TEST_EMAIL, TEST_PASSWORD, TEST_USER_ROLE } from "../../src/constants";

describe('user service', () => {
    let userId: number;

    beforeAll(async () => {
        await clearDB();
    });

    it('create', async () => {
        const user = await UserService.createUser({
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
            role: TEST_USER_ROLE
        });

        userId = user.id;

        expect(user.email).toEqual(TEST_EMAIL);
        expect(user.password).toEqual(TEST_PASSWORD);
        expect(user.role).toEqual(TEST_USER_ROLE);
    });

    it('find one', async () => {
        const user = await UserService.findOne(userId);

        expect(user?.email).toEqual(TEST_EMAIL);
        expect(user?.role).toEqual(TEST_USER_ROLE);
    });

    it('find one by email', async () => {
        const user = await UserService.findOneByEmail(TEST_EMAIL);

        expect(user?.id).toEqual(userId);
        expect(user?.email).toEqual(TEST_EMAIL);
        expect(user?.role).toEqual(TEST_USER_ROLE);
    });

    afterAll(async () => await clearDB());
});
