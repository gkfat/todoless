import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'CreateLabelRequest' })
export class CreateLabelDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'label title' })
        title: string;

    @ApiProperty({
        description: 'label color', required: false, 
    })
        color?: string;
}