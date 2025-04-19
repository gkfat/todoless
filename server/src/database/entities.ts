import { AccountAuth } from 'src/modules/accounts/entities/account-auth.entity';
import { AccountDashboardConfig } from 'src/modules/accounts/entities/account-dashboard-config.entity';
import { Category } from 'src/modules/categories/entities/categories.entity';
import { Role } from 'src/modules/privileges/entities/role.entity';
import { Todo } from 'src/modules/todos/entities/todo.entity';

import { Account } from '../modules/accounts/entities/account.entity';

export const entities = [
    Account,
    AccountAuth,
    AccountDashboardConfig,
    Role,
    Category,
    Todo,
];