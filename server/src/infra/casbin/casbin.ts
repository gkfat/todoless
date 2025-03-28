import {
    Enforcer,
    Model,
    StringAdapter,
} from 'casbin';
import { assert } from 'console';
import { Privileges } from 'src/enums';

/**
 * create casbin auth model
 *
 * @see https://casbin.org/docs/en/model-storage#load-model-from-code
 */
const createAuthModel = () => {
    const model = new Model();

    // [request_definition]
    // sub: subject, the user that wants to access a resource.
    // obj: object, the resource that is going to be accessed.
    // act: action, do what on the obj(read, write, ...etc)
    model.loadModelFromText(`
        [request_definition]
        r = sub, obj, act

        [policy_definition]
        p = sub, obj, act

        [role_definition]
        g = _, _

        [policy_effect]
        e = some(where (p.eft == allow))

        [matchers]
        m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act || g(r.sub, "super")
    `);

    return model;
};

const definePolicy = (privileges: typeof Privileges) => {
    const rules = Object.entries(privileges)
        .flatMap(
            ([role, permissions]) => permissions.map((p) => {
                const splitStr = p.split('.');
                assert(splitStr.length === 3, `Invalid format of permission: ${p}`);

                const subject = role;
                const object = splitStr.slice(0, 2).join('.');
                const action = splitStr.slice(-1).join('');

                return [
                    subject,
                    object,
                    action,
                ];
            }),
        );

    const csvFormatRules = rules.map((rule) => `p,${rule.join()}`).join('\n');

    return new StringAdapter(csvFormatRules);
};

export const initCasbin = async (privileges: typeof Privileges) => {
    const adapter = definePolicy(privileges);
    const model = createAuthModel();
    const enforcer = new Enforcer();

    await enforcer.initWithModelAndAdapter(model, adapter);

    return enforcer;
};
