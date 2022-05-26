import jsonwebtoken, { VerifyErrors } from "jsonwebtoken";
import { ClientData, cookieProps } from "../types";
import { generatedJwtSecret } from "../constants";

interface Options {
    expiresIn: string;
}

export class JwtService {
    private readonly secret: string;
    private readonly options: Options;
    private readonly VALIDATION_ERROR = 'JSON-web-token validation failed.';

    constructor() {
        this.secret = (process.env.JWT_SECRET || generatedJwtSecret);
        this.options = {expiresIn: String(cookieProps.options.maxAge || 259200000)};
    }


    /**
     * Encrypt data and return jwt.
     *
     * @param data
     */
    public getJwt(data: ClientData): Promise<string> {
        return new Promise((resolve, reject) => {
            jsonwebtoken.sign(data, this.secret, this.options, (err, token) => {
                err ? reject(err) : resolve(token || '');
            });
        });
    }


    /**
     * Decrypt JWT and extract client data.
     *
     * @param jwt
     */
    public decodeJwt(jwt: string): Promise<ClientData> {
        return new Promise((res, rej) => {
            jsonwebtoken.verify(jwt, this.secret, (err: VerifyErrors | null, decoded?: object) => {
                return err ? rej(this.VALIDATION_ERROR) : res(decoded as ClientData);
            });
        });
    }
}
