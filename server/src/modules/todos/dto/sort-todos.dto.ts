import {
    IsArray,
    IsNotEmpty,
} from 'class-validator';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'SortingTodoDto' })
export class SortingTodoDto {
    @ApiProperty({ description: 'category id associated with the category' })
        categoryId: number;

    @ApiProperty({ description: 'todo id' })
        id: number;

    @ApiProperty({ description: 'todo sort order' })
        order: number;
}

@ApiSchema({ name: 'SortTodosRequest' })
export class SortTodosDto {
    @IsNotEmpty()
    @IsArray()
    @ApiProperty({
        description: 'todos to sort', type: [SortingTodoDto], 
    })
        todos: SortingTodoDto[];
}