import {
    EnumRole,
    Permissions,
    Privileges,
} from 'src/enums';
import { Role } from 'src/modules/privileges/entities/role.entity';

import { flattenValues } from './object';

function getPermissionsByRoles(roles: Role[]) {
    const permissionsSet = new Set<string>();

    roles.forEach((role) => {
        if (role.role === EnumRole.SUPER) {
            const permissions = flattenValues(Permissions);
            permissions.forEach((p) => permissionsSet.add(p));
        }

        if (!Privileges[role.role]) {
            return;
        }

        Privileges[role.role].forEach((p) => permissionsSet.add(p));
    });

    return Array.from(permissionsSet).sort((a, b) => a.localeCompare(b));
}

export { getPermissionsByRoles };