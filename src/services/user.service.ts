import { initUser, UserAttributes, UserCreationAttributes } from '../db/models/user.model';

const User = module.require('../db/models').User as ReturnType<typeof initUser>;

class UserService {
    public findOne(id: UserAttributes['id']) {
        return User.findOne({ where: { id }, attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            }
        })
    }

    public findOneByEmail(email: UserCreationAttributes['email']) {
        return User.findOne({ where: { email } })
    }

    public createUser({email, password, role }: UserCreationAttributes) {
        return User.create({ password, role, email })
    }
}

export default new UserService();
