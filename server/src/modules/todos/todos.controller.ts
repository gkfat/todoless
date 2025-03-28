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
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
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
        @Res() res: Response<Todo[]>,
    ) {
        const { scope: { sub } } = payload;

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
            throw new NotFoundException(`Category ${reqBody.categoryId} not found`);
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

}
