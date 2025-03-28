import {
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'CreateTodoRequest' })
export class CreateTodoDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'todo title' })
        title: string;
    
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'category id' })
        categoryId: number;

    @ApiProperty({
        description: 'todo due date', required: false, 
    })
        dueDate?: Date;
}