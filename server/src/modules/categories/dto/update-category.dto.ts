import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'UpdateCategoryRequest' })
export class UpdateCategoryDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'category title' })
        title: string;

    @ApiProperty({
        description: 'category color', required: false, 
    })
        color?: string;
}

