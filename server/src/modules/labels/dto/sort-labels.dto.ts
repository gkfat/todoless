import {
    IsArray,
    IsNotEmpty,
} from 'class-validator';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'SortingLabelDto' })
export class SortingLabelDto {
    @ApiProperty({ description: 'Account ID associated with the label' })
        accountId: number;

    @ApiProperty({ description: 'Label ID' })
        id: number;

    @ApiProperty({ description: 'Sort order of the label' })
        order: number;
}

@ApiSchema({ name: 'SortLabelsRequest' })
export class SortLabelsDto {
    @IsNotEmpty()
    @IsArray()
    @ApiProperty({
        description: 'labels to sort', type: [SortingLabelDto], 
    })
        labels: SortingLabelDto[];
}