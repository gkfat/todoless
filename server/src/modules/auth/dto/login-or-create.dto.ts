import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    Matches,
    MaxLength,
    MinLength,
    ValidateIf,
} from 'class-validator';
import { EnumLoginType } from 'src/enums';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'LoginRequest' })
export class LoginOrCreateDto {
    @IsEnum(EnumLoginType)
    @IsNotEmpty()
    @ApiProperty({
        type: 'string', enum: EnumLoginType, 
    })
        type: EnumLoginType;

    @ValidateIf((o) => o.type === EnumLoginType.PASSWORD)
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        required: false, description: 'required when using password type',
        example: 'super@todoless.com',
    })
        email?: string;

    @ValidateIf((o) => o.type === EnumLoginType.PASSWORD)
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(10)
    @Matches(/^[A-Za-z0-9]{4,10}$/, { message: 'Must use only a-z or 0-9' })
    @ApiProperty({
        required: false, description: 'required when using password type', 
        example: 'super',
    })
        password?: string;

    @ValidateIf((o) => o.type === EnumLoginType.GOOGLE)
    @IsNotEmpty()
    @ApiProperty({
        required: false, description: 'required when using google login type', 
    })
        code?: string;
}