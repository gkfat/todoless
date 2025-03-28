import {
    IsArray,
    IsNotEmpty,
} from 'class-validator';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'SortingCategoryDto' })
export class SortingCategoryDto {
    @ApiProperty({ description: 'account id associated with the category' })
        accountId: number;

    @ApiProperty({ description: 'category id' })
        id: number;

    @ApiProperty({ description: 'category sort order' })
        order: number;
}

@ApiSchema({ name: 'SortCategoriesRequest' })
export class SortCategoriesDto {
    @IsNotEmpty()
    @IsArray()
    @ApiProperty({
        description: 'category to sort', type: [SortingCategoryDto], 
    })
        categories: SortingCategoryDto[];
}