import {
    EnumLoginType,
    EnumRole,
} from 'src/enums';
import { makeDefaultDashboardConfigs } from 'src/modules/accounts/accounts.service';
import { AccountAuth } from 'src/modules/accounts/entities/account-auth.entity';
import { Account } from 'src/modules/accounts/entities/account.entity';
import { Role } from 'src/modules/privileges/entities/role.entity';
import { hashPassword } from 'src/utils/credential';
import {
    DataSource,
    Repository,
} from 'typeorm';
import { Seeder } from 'typeorm-extension';

const seedRoles = async (roleRepository: Repository<Role>) => {
    const roles = Object.values(EnumRole);

    for (const role of roles) {
        const newRole = new Role({ role });
        await roleRepository.upsert(newRole, ['role']);
    }
};

const seedSuperAccount = async (accountRepository: Repository<Account>, roleRepository: Repository<Role>) => {
    const name = 'super';
    const email = process.env.SUPER_EMAIL || 'super@todoless.com';
    const password = process.env.SUPER_PASSWORD ?? 'super123';

    const superRole = await roleRepository.findOneBy({ role: EnumRole.SUPER });

    const accountAuth = new AccountAuth({
        type: EnumLoginType.PASSWORD,
        identifier: email,
        credential: hashPassword(password),
    });

    const superAccount = new Account({
        name,
        email,
        enabled: true,
        email_verified: true,
        auths: [accountAuth],
        roles: [superRole],
        dashboard_configs: makeDefaultDashboardConfigs(),
    });

    const findConflict = await accountRepository.findOne({
        where: { email },
        relations: {
            auths: true,
            roles: true, 
            dashboard_configs: true,
        },
        withDeleted: false,
    });

    if (!findConflict) {
        await accountRepository.save(superAccount);
    }
};

export class AccountSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
    ) {
        const roleRepository = dataSource.getRepository(Role);
        const accountRepository = dataSource.getRepository(Account);

        await seedRoles(roleRepository);
        await seedSuperAccount(accountRepository, roleRepository);
    }
}