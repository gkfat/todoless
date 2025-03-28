import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'CreateCategoryRequest' })
export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'category title' })
        title: string;

    @ApiProperty({
        description: 'category color', required: false, 
    })
        color?: string;
}