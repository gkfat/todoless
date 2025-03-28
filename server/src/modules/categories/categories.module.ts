import { MiddlewaresModule } from 'src/middlewares/middlewares.module';

import { Module } from '@nestjs/common';

import { AccountsModule } from '../accounts/accounts.module';
import { TodosService } from '../todos/todos.service';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
    imports: [AccountsModule, MiddlewaresModule],
    controllers: [CategoriesController],
    providers: [CategoriesService, TodosService],
    exports: [CategoriesService],
})
export class CategoriesModule {}
