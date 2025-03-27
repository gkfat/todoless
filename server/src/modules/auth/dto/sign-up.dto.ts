import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import { REGEX_PASSWORD } from 'src/utils/credential';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'SendVerificationCodeRequest' })
export class SendVerificationCodeDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        description: 'Unique key of account', example: 'super@todoless.com', 
    })
        email: string;
}

@ApiSchema({ name: 'VerifyCodeRequest' })
export class VerifyCodeDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        description: 'Unique key of account', example: 'super@todoless.com', 
    })
        email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'verification code received from email' })
        verificationCode: string;
}

@ApiSchema({ name: 'SignUpRequest' })
export class SignUpDto {
    constructor(auth: Partial<SignUpDto>) {
        Object.assign(this, auth);
    }
    
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        description: 'Unique key of account', example: 'super@todoless.com', 
    })
        email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    @ApiProperty({ description: 'At least 1, most 20 characters' })
        name: string;

    @IsNotEmpty()
    @IsString()
    @Matches(REGEX_PASSWORD, { message: 'Must use only a-z or 0-9' })
    @ApiProperty({ description: 'At least 6, most 10 characters' })
        password: string;
}