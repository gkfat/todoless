import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
} from 'class-validator';
import { REGEX_PASSWORD } from 'src/utils/credential';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'CreateAccountRequest' })
export class CreateAccountDto {
    @IsEmail()
    @ApiProperty({ description: 'Unique key of account' })
        email: string;

    @IsString()
    @ApiProperty()
        name: string;

    @IsNotEmpty()
    @IsString()
    @Matches(REGEX_PASSWORD, { message: 'Must use only a-z or 0-9' })
    @ApiProperty({ description: 'At least 6, most 10 characters' })
        password: string;
}