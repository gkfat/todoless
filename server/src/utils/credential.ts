import * as bcrypt from 'bcrypt';
import { AccountAuth } from 'src/modules/accounts/entities/account-auth.entity';
import { LoginOrCreateDto } from 'src/modules/auth/dto/login-or-create.dto';

/** 密碼組成規則: 6~10 位英數字 */
const REGEX_PASSWORD = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,10}$/;

function hashPassword(password: string) {
    return bcrypt.hashSync(password, 10);
}

function verifyPassword(input: string, hashedPassword: string) {
    return bcrypt.compareSync(input, hashedPassword);
}

function verifyPasswordLogin(inputAuth: LoginOrCreateDto, dbAuth: AccountAuth) {
    if (!dbAuth.identifier || !inputAuth.email || !inputAuth.password) {
        return false;
    }

    const validIdentifier = dbAuth.identifier === inputAuth.email;
    const validCredential = verifyPassword(inputAuth.password, dbAuth.credential);

    return validIdentifier && validCredential;
}

export {
    hashPassword,
    REGEX_PASSWORD,
    verifyPassword,
    verifyPasswordLogin,
};
