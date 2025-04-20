import {
    DashboardCardType,
    EnumLoginType,
    EnumRole,
} from 'src/enums';
import { Role } from 'src/modules/privileges/entities/role.entity';
import { hashPassword } from 'src/utils/credential';
import { getPermissionsByRoles } from 'src/utils/permissions';
import {
    EntityManager,
    In,
    Repository,
} from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SignUpDto } from '../auth/dto/sign-up.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { AccountAuth } from './entities/account-auth.entity';
import { AccountDashboardConfig } from './entities/account-dashboard-config.entity';
import { Account } from './entities/account.entity';

export const makeDefaultDashboardConfigs = () => ([
    {
        type: DashboardCardType.CATEGORY_LIST,
        col: 1,
        order: 1,
        display: true,
    },
    {
        type: DashboardCardType.RECENTLY_ADDED,
        col: 1,
        order: 2,
        display: true,
    },
    {
        type: DashboardCardType.DUE_DATES,
        col: 1,
        order: 3,
        display: true,
    },
    {
        type: DashboardCardType.STARRED,
        col: 2,
        order: 1,
        display: true,
    },
    {
        type: DashboardCardType.RECENTLY_COMPLETED,
        col: 2,
        order: 2,
        display: true,
    },
].map((config) => new AccountDashboardConfig(config)));

@Injectable()
export class AccountsService {

    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
        private readonly entityManager: EntityManager,
    ) {}

    async create(createAccountDto: CreateAccountDto | SignUpDto) {
        const {
            email,
            password,
        } = createAccountDto;

        const findMemberRole = await this.entityManager.findOne(Role, { where: { role: EnumRole.MEMBER } });

        const newAccount = new Account({
            ...createAccountDto,
            roles: [findMemberRole],
            auths: [
                new AccountAuth({
                    type: EnumLoginType.PASSWORD,
                    identifier: email,
                    credential: hashPassword(password), 
                }),
            ],
            dashboard_configs: makeDefaultDashboardConfigs(),
        });

        const { id } = await this.accountRepository.save(newAccount);

        return await this.accountRepository.findOne({
            where: { id },
            relations: { roles: true },
        });
    }

    async update(id: number, updateAccountDto: UpdateAccountDto) {
        const {
            name,
            password,
        } = updateAccountDto;

        const account = await this.accountRepository.findOne({
            where: { id }, relations: { auths: true }, 
        });

        account.name = name;
        
        const findPasswordTypeAuth = account.auths.find((auth) => auth.type === EnumLoginType.PASSWORD);

        if (findPasswordTypeAuth) {
            findPasswordTypeAuth.credential = hashPassword(password);
        }
 
        await this.accountRepository.save(account);

        return account;
    }

    async updateConfig(id: number, updateConfigDto: UpdateConfigDto) {
        const { dashboardConfigs } = updateConfigDto;

        const account = await this.accountRepository.findOne({
            where: { id },
            relations: {
                roles: true,
                dashboard_configs: true, 
            },
        });

        account.dashboard_configs = dashboardConfigs.map((config) => new AccountDashboardConfig(config));

        const res = await this.accountRepository.save(account);

        return res;
    }
    
    async findAll() {
        return this.accountRepository.find({ relations: { roles: true } });
    }

    async findOne(id: number) {
        const account = await this.accountRepository.findOne({
            where: { id },
            select: {
                id: true,
                create_at: true,
                email: true,
                last_login_at: true,
                name: true,
                roles: true,
                update_at: true,
                email_verified: true,
                enabled: true,
            },
            relations: {
                roles: true,
                dashboard_configs: true, 
            },
            withDeleted: false,
        });

        const getPermissions = account ? getPermissionsByRoles(account.roles) : [];

        return {
            ...account,
            permissions: getPermissions,
        };
    }

    async findOneByEmail(email: string) {
        return this.accountRepository.findOneBy({ email });
    }

    async updateAccountRoles(id: number, roleIds: number[]) {
        const account = await this.accountRepository.findOne({
            where: { id },
            relations: { roles: true }, 
        });

        const findRoles = await this.entityManager.find(Role, { where: { id: In(roleIds) } });

        account.roles = findRoles;

        return await this.accountRepository.save(account);
    }

    async enableAccount(id: number) {
        const account = await this.accountRepository.findOneBy({ id });

        account.enabled = !account.enabled;

        return await this.accountRepository.save(account);
    }

    async deleteAccount(id: number) {
        return await this.entityManager.transaction(async (trx) => {
            const accountAuths = await trx.findBy(AccountAuth, { account_id: id });
            await trx.remove(accountAuths);

            const dashboardConfigs = await trx.findBy(AccountDashboardConfig, { account_id: id });
            await trx.remove(dashboardConfigs);

            const account = await trx.findOneBy(Account, { id });

            return await trx.remove(account);
        });
    }

}

