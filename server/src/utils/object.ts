/**
 * Get object flattened values
 *
 * @example
 * flattenValues({
 *   a:1,
 *   b:{
 *     c:2,
 *     d:{
 *       e:3
 *     }
 *   }
 * });// [1,2,3]
 */
export const flattenValues = (obj: object) => {
    try {
        JSON.stringify(obj);
    } catch {
        throw new Error('Circle reference');
    }

    if (obj === null) return [null];

    const rs = [];
    const values = Object.values(obj);

    while (values.length) {
        const v = values.shift();
        if (typeof v === 'object' && v !== null) {
            values.push(...Object.values(v));
        } else {
            rs.push(v);
        }
    }

    return rs;
};
