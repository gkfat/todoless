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
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
} from '@nestjs/swagger';

import { AccountsService } from '../accounts/accounts.service';
import { CategoriesService } from '../categories/categories.service';
import { CreateTodoDto } from './dto/create-todo.dto';
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

}
