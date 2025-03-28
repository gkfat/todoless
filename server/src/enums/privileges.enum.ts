import { Permissions } from './permissions.enum';
import { EnumRole } from './role.enum';

const {
    account,
    dashboard,
    todo,
    category,
} = Permissions;

const basicPermissions = [
    account.me.get,
    account.me.update,
    dashboard.dashboard.get,

    category.categories.get,
    category.categories.add,
    category.categories.update,
    category.categories.delete,

    todo.todos.get,
    todo.todos.add,
    todo.todos.update,
    todo.todos.delete,
];

export const Privileges = { [EnumRole.MEMBER]: [...basicPermissions] };