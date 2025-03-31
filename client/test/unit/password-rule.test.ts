import {
    describe,
    expect,
    it,
} from 'vitest';

import { REGEX_PASSWORD } from '@/utils/credential';

const errorString = {
    required: '此欄位為必填',
    notMatch: '密碼必須由 6~10 位英數字組成',
};
const schema = yup.string().required(errorString.required).matches(REGEX_PASSWORD, errorString.notMatch);

describe('Password rule', () => {
    describe.each(['abc123', '123abc'])('should pass with value: $value', (value) => {
        it('should pass', async () => {
            await expect(schema.validate(value)).resolves.toBeTruthy();
        });
    });

    describe.each([
        {
            value: '', expected: errorString.required, 
        },
        {
            value: null, expected: errorString.required, 
        },
        {
            value: undefined, expected: errorString.required, 
        },
        {
            value: 'ab', expected: errorString.notMatch, 
        },
        {
            value: '1', expected: errorString.notMatch, 
        },
        {
            value: 'aaaaaaa', expected: errorString.notMatch, 
        },
        {
            value: '1111111', expected: errorString.notMatch, 
        },
    ])('should throw error: $expected with value: $value', ({
        value, expected, 
    }) => {
        it('should throw', async () => {
            await expect(schema.validate(value)).rejects.toThrow(expected);
        });
    });
});