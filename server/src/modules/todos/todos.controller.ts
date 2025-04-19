import { Response } from 'express';
import { RequirePermissions } from 'src/decorators/require-permissions.decorators';
import {
    $TokenPayload,
    ITokenPayload,
} from 'src/decorators/token-payload.decorators';
import { Permissions } from 'src/enums';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PermissionsGuard } from 'src/middlewares/permissions.guard';

import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
} from '@nestjs/swagger';

import { AccountsService } from '../accounts/accounts.service';
import { CategoriesService } from '../categories/categories.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { SortTodosDto } from './dto/sort-todos.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodosService } from './todos.service';

@ApiBearerAuth('Authorization')
@Controller('todos')
export class TodosController {
    constructor(
        private readonly todosService: TodosService,
        private readonly accountsService: AccountsService,
        private readonly categoriesService: CategoriesService,
    ) {}

    @Get()
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.todo.todos.get)
    @ApiOkResponse({ type: [Todo] })
    async list(
        @$TokenPayload() payload: ITokenPayload | null,
        @Query('categoryId') categoryId: string,
        @Res() res: Response<Todo[]>,
    ) {
        const { scope: { sub } } = payload;

        if (categoryId) {
            const findCategory = await this.categoriesService.findOne(+categoryId);

            if (!findCategory || findCategory.account.id !== sub) {
                throw new UnauthorizedException('Unauthorized to operate this category');
            }

            const rs = await this.todosService.findAllByCategoryId(findCategory.id);
            return res.json(rs);
        }

        const rs = await this.todosService.findAllByAccountId(+sub);

        return res.json(rs);
    }

    @Post('create')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.todo.todos.add)
    @ApiOkResponse({ type: Todo })
    async create(
        @$TokenPayload() payload: ITokenPayload | null,
        @Body() reqBody: CreateTodoDto,
        @Res() res: Response<Todo>,
    ) {
        const { scope: { sub } } = payload;

        const account = await this.accountsService.findOne(+sub);

        const findCategory = await this.categoriesService.findOne(reqBody.categoryId);

        if (!findCategory) {
            reqBody.categoryId = null;
        }

        const rs = await this.todosService.create(account, findCategory,  reqBody);

        return res.json(rs);
    }
   
    @Put(':id/update')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.todo.todos.update)
    @ApiOkResponse({ type: Todo })
    async update(
        @$TokenPayload() payload: ITokenPayload,
        @Param('id') id: string,
        @Body() reqBody: UpdateTodoDto,
        @Res() res: Response<Todo>,
    ) {
        const { scope: { sub } } = payload;

        const findTodo = await this.todosService.findOne(+id);

        if (!findTodo) {
            throw new NotFoundException(`Todo ${id} not found`);
        }

        if (findTodo.account.id !== sub) {
            throw new UnauthorizedException('Unauthorized to update this todo');
        }

        if (reqBody.categoryId >= 0) {
            const findCategory = await this.categoriesService.findOne(reqBody.categoryId);

            if (findCategory?.account.id !== sub) {
                throw new UnauthorizedException('Unauthorized to operate this category');
            }
        }

        const todoId = await this.todosService.update(+id, reqBody);
        const rs = await this.todosService.findOne(todoId);
        
        return res.json(rs);
    }
    
    @Put(':id/completed')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.todo.todos.update)
    @ApiOkResponse({ type: Todo })
    async completed(
        @$TokenPayload() payload: ITokenPayload,
        @Param('id') id: string,
        @Res() res: Response<Todo>,
    ) {
        const { scope: { sub } } = payload;

        const findTodo = await this.todosService.findOne(+id);

        if (!findTodo) {
            throw new NotFoundException(`Todo ${id} not found`);
        }

        if (findTodo.account.id !== sub) {
            throw new UnauthorizedException('Unauthorized to update this todo');
        }

        const todoId = await this.todosService.completed(+id);
        const rs = await this.todosService.findOne(todoId);
        
        return res.json(rs);
    }

    @Put(':id/un-completed')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.todo.todos.update)
    @ApiOkResponse({ type: Todo })
    async unCompleted(
        @$TokenPayload() payload: ITokenPayload,
        @Param('id') id: string,
        @Res() res: Response<Todo>,
    ) {
        const { scope: { sub } } = payload;

        const findTodo = await this.todosService.findOne(+id);

        if (!findTodo) {
            throw new NotFoundException(`Todo ${id} not found`);
        }

        if (findTodo.account.id !== sub) {
            throw new UnauthorizedException('Unauthorized to update this todo');
        }

        const todoId = await this.todosService.unCompleted(+id);
        const rs = await this.todosService.findOne(todoId);
        
        return res.json(rs);
    }

    @Post('sort')
        @UseGuards(AuthGuard, PermissionsGuard)
        @RequirePermissions(Permissions.todo.todos.update)
        @ApiOkResponse({ type: [Todo] })
    async sort(
            @$TokenPayload() payload: ITokenPayload | null,
            @Body() reqBody: SortTodosDto,
            @Res() res: Response<Todo[]>,
    ) {
        const { scope: { sub } } = payload;
        const findAllTodos = await this.todosService.findAllByAccountId(+sub);
    
        reqBody.todos.forEach((todo) => {
            const todoExist = findAllTodos.find((v) => v.category.id === todo.categoryId && v.id === todo.id);
    
            if (!todoExist) {
                throw new BadRequestException(`not exist todo ${todo.id}`);
            }
        });
    
        await this.todosService.sort(reqBody);
            
        const rs = await this.todosService.findAllByCategoryId(reqBody.todos[0].categoryId);
    
        return res.json(rs);
    }
    
    @Delete(':id')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.todo.todos.delete)
    @ApiOkResponse({ type: Number })
    async delete(
        @$TokenPayload() payload: ITokenPayload,
        @Param('id') id: string,
        @Res() res: Response<number>,
    ) {
        const { scope: { sub } } = payload;
    
        const findTodo = await this.todosService.findOne(+id);
    
        if (findTodo.account.id !== sub) {
            throw new UnauthorizedException('Unauthorized to update this todo');
        }
    
        const rs = await this.todosService.delete(+id);
    
        return res.json(rs);
    }

}
