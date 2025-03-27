import { Permissions } from './permissions.enum';
import { EnumRole } from './role.enum';

const {
    account, dashboard,
} = Permissions;

const basicPermissions = [
    account.me.get,
    account.me.update,
    dashboard.dashboard.get,
];

export const Privileges = { [EnumRole.MEMBER]: [...basicPermissions] };