import { Permissions } from './permissions.enum';
import { EnumRole } from './role.enum';

const {
    account,
    dashboard,
    todo,
    label,
} = Permissions;

const basicPermissions = [
    account.me.get,
    account.me.update,
    dashboard.dashboard.get,

    label.labels.get,
    label.labels.add,
    label.labels.update,
    label.labels.delete,

    todo.todos.get,
    todo.todos.add,
    todo.todos.update,
    todo.todos.delete,
];

export const Privileges = { [EnumRole.MEMBER]: [...basicPermissions] };