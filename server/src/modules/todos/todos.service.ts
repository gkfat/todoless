import {
    EntityManager,
    Repository,
} from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Account } from '../accounts/entities/account.entity';
import { Category } from '../categories/entities/categories.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { SortTodosDto } from './dto/sort-todos.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
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
            relations: {
                account: true,
                category: true,
            },
            select: {
                id: true,
                title: true,
                order: true,
                completed_at: true,
                due_date: true,
                starred: true,
                create_at: true,
                update_at: true,
                delete_at: true,
                category: {
                    id: true,
                    title: true,
                    order: true, 
                    color: true,
                },
                account: { id: true },
            },
            order: {
                category: {
                    order: 'ASC', 
                    create_at: 'DESC',
                },
                order: 'ASC', 
                create_at: 'DESC',
            },
            withDeleted: false,
        });
        
        return res;
    }

    async findAllByCategoryId(categoryId: number) {
        const res = await this.todosRepository.find({
            where: { category: { id: categoryId } },
            relations: {
                account: true,
                category: true,
            },
            select: {
                id: true,
                title: true,
                order: true,
                completed_at: true,
                due_date: true,
                starred: true,
                create_at: true,
                update_at: true,
                delete_at: true,
                category: {
                    id: true,
                    title: true,
                    order: true, 
                    color: true,
                },
                account: { id: true },
            },
            order: {
                category: {
                    order: 'ASC', 
                    create_at: 'DESC',
                },
                order: 'ASC', 
                create_at: 'DESC',
            },
            withDeleted: false,
        });
        
        return res;
    }

    async findOne(id: number) {
        const res = await this.todosRepository.findOne({
            where: { id },
            relations: {
                account: true,
                category: true,
            },
            select: {
                id: true,
                title: true,
                order: true,
                completed_at: true,
                due_date: true,
                starred: true,
                create_at: true,
                update_at: true,
                delete_at: true,
                category: {
                    id: true,
                    title: true,
                    order: true, 
                    color: true,
                },
                account: { id: true },
            },
            withDeleted: false,
        });
        
        return res;
    }

    async create(account: Account, category: Category, req: CreateTodoDto) {
        const newTodo = this.todosRepository.create({
            ...req,
            order: 0,
            account,
            category,
        });

        const saveTodo = await this.todosRepository.save(newTodo);

        return saveTodo;
    }

    async update(id: number, req: UpdateTodoDto) {
        const result = await this.entityManager.transaction(async (trx) => {
            const {
                categoryId,
                title,
                dueDate,
                starred,
            } = req;
            
            const findTodo = await trx.findOne(Todo, {
                where: { id }, withDeleted: false, 
            });

            // 若 categoryId = -1 會設為未分類
            if (categoryId === -1) {
                findTodo.category = null;
            } else {
                const findCategory = await trx.findOne(Category, { where: { id: categoryId } });

                findTodo.category = findCategory;
            }
            
            if (title) {
                findTodo.title = title;
            }
     
            if (dueDate !== undefined) {
                findTodo.due_date = dueDate !== null ? new Date(dueDate) : null;
            }

            if (starred !== undefined) {
                findTodo.starred = starred;
            }

            return await trx.save(findTodo);
        });

        return result.id;
    }

    async completed(id: number) {
        const result = await this.entityManager.transaction(async (trx) => {
            const findTodo = await trx.findOne(Todo, {
                where: { id }, withDeleted: false, 
            });

            findTodo.completed_at = new Date();

            return await trx.save(findTodo);
        });

        return result.id;
    }

    async unCompleted(id: number) {
        const result = await this.entityManager.transaction(async (trx) => {
            const findTodo = await trx.findOne(Todo, {
                where: { id }, withDeleted: false, 
            });

            findTodo.completed_at = null;

            return await trx.save(findTodo);
        });

        return result.id;
    }

    async sort(req: SortTodosDto) {
        await this.entityManager.createQueryBuilder()
            .update(Todo)
            .set({ order: () => 'CASE id ' + req.todos.map((t) => `WHEN ${t.id} THEN ${t.order}`).join(' ') + ' END' })
            .where('id IN (:...ids)', { ids: req.todos.map((t) => t.id) })
            .execute();
    }
    
    async delete(id: number) {
        return await this.entityManager.transaction(async trx => {
            await trx.softDelete(Todo, { id });
    
            return id;
        });
    }
}

