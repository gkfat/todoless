import { AccountAuth } from 'src/modules/accounts/entities/account-auth.entity';
import { Category } from 'src/modules/categories/entities/categories.entity';
import { Role } from 'src/modules/privileges/entities/role.entity';
import { Todo } from 'src/modules/todos/entities/todo.entity';

import {
    Global,
    Module,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Account } from '../modules/accounts/entities/account.entity';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([
            Account,
            AccountAuth,
            Role,
            Category,
            Todo,
        ]),
    ],
    exports: [TypeOrmModule],
})
export class TypeOrmFeatureModule {}