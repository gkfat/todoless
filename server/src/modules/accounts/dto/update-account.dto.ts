import {
    IsString,
    Matches,
} from 'class-validator';
import { REGEX_PASSWORD } from 'src/utils/credential';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'UpdateAccountRequest' })
export class UpdateAccountDto {
    @IsString()
    @ApiProperty()
        name: string;

    @IsString()
    @Matches(REGEX_PASSWORD, { message: 'Must use only a-z or 0-9' })
    @ApiProperty({
        description: 'At least 6, most 10 characters', required: false, 
    })
        password?: string;
}

@ApiSchema({ name: 'UpdateAccountResponse' })
export class UpdateAccountResponseDto {
    @ApiProperty()
        token: string;
}