import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'UpdateCategoryRequest' })
export class UpdateCategoryDto {
    @ApiProperty({
        description: 'category title', required: false, 
    })
        title?: string;

    @ApiProperty({
        description: 'category color', required: false, 
    })
        color?: string;
}

