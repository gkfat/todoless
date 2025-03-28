import { Module } from '@nestjs/common';

import { MiddlewaresModule } from '../../middlewares/middlewares.module';
import { AccountsModule } from '../accounts/accounts.module';
import { CategoriesService } from '../categories/categories.service';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
    imports: [AccountsModule, MiddlewaresModule],
    controllers: [TodosController],
    providers: [CategoriesService, TodosService],
    exports: [TodosService],
})
export class TodosModule {}
