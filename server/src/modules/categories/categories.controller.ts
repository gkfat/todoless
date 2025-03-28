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
import { Todo } from '../todos/entities/todo.entity';
import { TodosService } from '../todos/todos.service';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SortCategoriesDto } from './dto/sort-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/categories.entity';

@ApiBearerAuth('Authorization')
@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService,
        private readonly todosService: TodosService,
        private readonly accountsService: AccountsService,
    ) {}

    @Get()
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.category.categories.get)
    @ApiOkResponse({ type: [Category] })
    async list(
        @$TokenPayload() payload: ITokenPayload | null,
        @Res() res: Response<Category[]>,
    ) {
        const { scope: { sub } } = payload;

        const rs = await this.categoriesService.findAllByAccountId(+sub);

        return res.json(rs);
    }

    @Get('/:id/todos')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.todo.todos.get)
    @ApiOkResponse({ type: [Todo] })
    async listTodos(
        @$TokenPayload() payload: ITokenPayload | null,
        @Param('id') id: string,
        @Res() res: Response<Todo[]>,
    ) {
        const { scope: { sub } } = payload;

        const findCategory = await this.categoriesService.findOne(+id);

        if (findCategory.account.id !== sub) {
            throw new UnauthorizedException('Unauthorized to  this category');
        }

        const rs = await this.todosService.findAllByCategoryId(findCategory.id);

        return res.json(rs);
    }

    @Post('create')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.category.categories.add)
    @ApiOkResponse({ type: Category })
    async create(
        @$TokenPayload() payload: ITokenPayload | null,
        @Body() reqBody: CreateCategoryDto,
        @Res() res: Response<Category>,
    ) {
        const { scope: { sub } } = payload;

        const account = await this.accountsService.findOne(+sub);
        const rs = await this.categoriesService.create(account, reqBody);

        return res.json(rs);
    }

    @Put(':id/update')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.category.categories.update)
    @ApiOkResponse({ type: Category })
    async update(
        @$TokenPayload() payload: ITokenPayload,
        @Param('id') id: string,
        @Body() reqBody: UpdateCategoryDto,
        @Res() res: Response<Category>,
    ) {
        const { scope: { sub } } = payload;

        const findCategory = await this.categoriesService.findOne(+id);

        if (findCategory.account.id !== sub) {
            throw new UnauthorizedException('Unauthorized to update this category');
        }

        const categoryId = await this.categoriesService.update(+id, reqBody);
        const rs = await this.categoriesService.findOne(categoryId);
        
        return res.json(rs);
    }

    @Post('sort')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.category.categories.update)
    @ApiOkResponse({ type: [Category] })
    async sort(
        @$TokenPayload() payload: ITokenPayload | null,
        @Body() reqBody: SortCategoriesDto,
        @Res() res: Response<Category[]>,
    ) {
        const { scope: { sub } } = payload;
        const findAllCategories = await this.categoriesService.findAllByAccountId(+sub);

        reqBody.categories.forEach((c) => {
            const categoryExist = findAllCategories.find((v) => v.account.id === c.accountId && v.id === c.id);

            if (!categoryExist) {
                throw new BadRequestException(`not exist category ${c.id}`);
            }
        });

        await this.categoriesService.sort(reqBody);
        
        const rs = await this.categoriesService.findAllByAccountId(+sub);

        return res.json(rs);
    }

    @Delete(':id')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.category.categories.delete)
    @ApiOkResponse({ type: Number })
    async delete(
        @$TokenPayload() payload: ITokenPayload,
        @Param('id') id: string,
        @Res() res: Response<number>,
    ) {
        const { scope: { sub } } = payload;

        const findCategory = await this.categoriesService.findOne(+id);

        if (findCategory.account.id !== sub) {
            throw new UnauthorizedException('Unauthorized to update this category');
        }

        const rs = await this.categoriesService.delete(+id);

        return res.json(rs);
    }
}
