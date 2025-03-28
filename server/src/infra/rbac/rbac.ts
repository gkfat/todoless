import { Enforcer } from 'casbin';
import {
    EnumRole,
    Privileges,
} from 'src/enums';

import { Injectable } from '@nestjs/common';

import { initCasbin } from '../casbin/casbin';

/**
 * get policy setting detail
 */
const getDetails = async (e: Enforcer) => {
    const fn = [
        e.getAllObjects,
        e.getAllRoles,
        e.getAllSubjects,
        e.getAllActions,
        e.getAllNamedObjects,
        e.getAllNamedRoles,
        e.getAllNamedSubjects,
        e.getAllNamedActions,
        e.getPolicy,
    ];

    const promises = fn.map(async (func) => {
        const rs = await func.call(e);
        return { [func.name]: rs };
    });

    const results = await Promise.all(promises);
    const details = Object.assign({}, ...results);

    return details;
};

@Injectable()
export class RbacService {
    private enforcer: Enforcer;

    async init(privileges: typeof Privileges) {
        this.enforcer = await initCasbin(privileges);

        const details = await getDetails(this.enforcer);
        console.log(details);
    }

    async hasPermission(roles: EnumRole[], resource: string, action: string) {
        let result = false;

        // 只要其中一個角色擁有權限就通過
        roles.forEach((role) => {
            if (this.enforcer.enforce(role, resource, action)) {
                result = true;
            }
        });

        return result;
    }
}

export const initRbac = async (rbacService: RbacService, privileges: typeof Privileges) => {
    await rbacService.init(privileges);
};