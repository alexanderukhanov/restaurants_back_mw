import { JwtService } from "../../src/helpers/JwtService";
import { TEST_USER_ID, TEST_USER_ROLE } from "../../src/constants";

describe('Jwt service', () => {
    const jwtService = new JwtService();
    let jwt = '';

    it('get jwt', async () => {
        jwt = await jwtService.getJwt({id: TEST_USER_ID, role: TEST_USER_ROLE});

        expect(jwt).toBeTruthy();
    });

    it('decode jwt', async () => {
        const decodedJwt = await jwtService.decodeJwt(jwt);

        expect(decodedJwt.id).toEqual(TEST_USER_ID);
        expect(decodedJwt.role).toEqual(TEST_USER_ROLE);
    });
});
