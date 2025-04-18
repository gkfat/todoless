import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'UpdateTodoRequest' })
export class UpdateTodoDto {
    @ApiProperty({
        description: 'todo category id', required: false,
    })
        categoryId?: number;
    
    @ApiProperty({
        description: 'todo title', required: false, 
    })
        title?: string;

    @ApiProperty({
        description: 'todo due date', required: false, 
    })
        dueDate?: Date;

    @ApiProperty({
        description: 'todo be starred or not', required: false,
    })
        starred?: boolean;
}

