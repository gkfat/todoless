import { validate } from 'class-validator';

import { SignUpDto } from './sign-up.dto';

function makeDto(password: string) {
    return new SignUpDto({
        email: 'test@example.com',
        name: 'Test',
        password,
    });
}

describe('SignUpDto', () => {
    describe.each(['abc123', '123abc'])('should pass with value: $value', (value) => {
        it('should pass', async () => {
            const dto = makeDto(value);
    
            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });
    });

    describe.each([
        '',
        null,
        undefined,
        'ab',
        '1',
        'aaaaaaa',
        '1111111',
    ])('should throw with value: $value', (value) => {
        it('should throw', async () => {
            const dto = makeDto(value);
               
            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
        });
    });

});