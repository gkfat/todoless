import {
    IsArray,
    IsNumber,
} from 'class-validator';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'UpdateAccountRolesRequest' })
export class UpdateAccountRolesDto {
    @IsArray()
    @IsNumber({}, { each: true })
    @ApiProperty({ type: [Number] })
        roleIds: number[];
}