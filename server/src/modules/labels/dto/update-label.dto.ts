import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'UpdateLabelRequest' })
export class UpdateLabelDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'label title' })
        title: string;

    @ApiProperty({
        description: 'label color', required: false, 
    })
        color?: string;
}

