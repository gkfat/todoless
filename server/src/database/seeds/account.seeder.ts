import {
    EnumLoginType,
    EnumRole,
} from 'src/enums';
import { AccountAuth } from 'src/modules/accounts/entities/account-auth.entity';
import { Account } from 'src/modules/accounts/entities/account.entity';
import { Role } from 'src/modules/privileges/entities/role.entity';
import { hashPassword } from 'src/utils/credential';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class AccountSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
    ) {
        const roleRepository = dataSource.getRepository(Role);
        const roles = Object.values(EnumRole);

        for (const role of roles) {
            const newRole = new Role({ role });
            await roleRepository.upsert(newRole, ['role']);
        }

        const accountRepository = dataSource.getRepository(Account);

        const name = 'super';
        const email = process.env.SUPER_EMAIL || 'super@todoless.com';
        const password = process.env.SUPER_PASSWORD
            ? hashPassword(process.env.SUPER_PASSWORD)
            : hashPassword('super123');

        const accountRole = await roleRepository.findOneBy({ role: EnumRole.SUPER });

        const accountAuth = new AccountAuth({
            type: EnumLoginType.PASSWORD,
            identifier: email,
            credential: password,
        });

        const superAccount = new Account({
            name,
            email,
            enabled: true,
            email_verified: true,
            auths: [accountAuth],
            roles: [accountRole],
        });

        const findConflict = await accountRepository.findOne({
            where: { email },
            relations: {
                auths: true,
                roles: true, 
            }, 
        });

        if (!findConflict) {
            await accountRepository.save(superAccount);
        } else {
            findConflict.auths[0].credential = password;
            findConflict.roles = superAccount.roles;

            await accountRepository.save(findConflict);
        }
    }
}