import {
    EntityManager,
    Repository,
} from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Account } from '../accounts/entities/account.entity';
import { Category } from '../categories/entities/categories.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {

    constructor(
        @InjectRepository(Todo)
        private readonly todosRepository: Repository<Todo>,
        private readonly entityManager: EntityManager,
    ) {}
    
    async findAllByAccountId(accountId: number) {
        const res = await this.todosRepository.find({
            where: { account: { id: accountId } },
            select: {
                id: true,
                title: true,
                order: true,
                completed: true,
                due_date: true,
                create_at: true,
                update_at: true,
                delete_at: true,
                category: {
                    id: true,
                    order: true, 
                },
                account: { id: true },
            },
            order: {
                category: { order: 'ASC' },
                order: 'ASC', 
            },
            withDeleted: false,
        });
        
        return res;
    }

    async findAllByCategoryId(categoryId: number) {
        const res = await this.todosRepository.find({
            where: { category: { id: categoryId } },
            select: {
                id: true,
                title: true,
                order: true,
                completed: true,
                due_date: true,
                create_at: true,
                update_at: true,
                delete_at: true,
                category: { id: true },
                account: { id: true },
            },
            order: { order: 'ASC' },
            withDeleted: false,
        });
        
        return res;
    }

    async findOne(id: number) {
        const res = await this.todosRepository.findOne({
            where: { id },
            select: {
                id: true,
                title: true,
                order: true,
                completed: true,
                due_date: true,
                create_at: true,
                update_at: true,
                delete_at: true,
                category: { id: true },
                account: { id: true },
            },
            withDeleted: false,
        });
        
        return res;
    }

    async create(account: Account, category: Category, req: CreateTodoDto) {
        const getMinOrder = await this.todosRepository
            .createQueryBuilder('todo')
            .where('todo.account_id = :accountId AND todo.category_id = :categoryId', {
                accountId: account.id,
                categoryId: req.categoryId,
            })
            .select('MIN(todo.order)', 'minOrder')
            .getRawOne();

        const newOrder = (getMinOrder?.minOrder && getMinOrder.minOrder > 0 ? getMinOrder.minOrder - 1 : 0);

        const newTodo = this.todosRepository.create({
            ...req,
            order: newOrder,
            account,
            category,
        });

        const saveTodo = await this.todosRepository.save(newTodo);

        return saveTodo;
    }
}

