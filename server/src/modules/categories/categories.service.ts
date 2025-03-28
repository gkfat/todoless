import {
    EntityManager,
    Repository,
} from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Account } from '../accounts/entities/account.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SortCategoriesDto } from './dto/sort-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/categories.entity';

@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(Category)
        private readonly categoriesRepository: Repository<Category>,
        private readonly entityManager: EntityManager,
    ) {}
    
    async findAllByAccountId(accountId: number) {
        const res = await this.entityManager.find(Category, {
            where: { account: { id: accountId } },
            relations: {
                account: true,
                todos: true, 
            },
            select: {
                id: true,
                title: true,
                order: true,
                color: true,
                create_at: true,
                update_at: true,
                delete_at: true,
                account: { id: true },
            },
            withDeleted: false,
            order: {
                order: 'ASC',
                create_at: 'DESC',
            },
        });
        
        return res;
    }

    async findOne(id: number) {
        const res = await this.entityManager.findOne(Category, {
            where: { id },
            relations: {
                account: true,
                todos: true, 
            },
            select: {
                id: true,
                title: true,
                order: true,
                color: true,
                create_at: true,
                update_at: true,
                delete_at: true,
                account: { id: true },
            },
            withDeleted: false,
        });
        
        return res;
    }

    async create(account: Account, req: CreateCategoryDto) {
        const newCategory = this.categoriesRepository.create({
            ...req,
            order: 0,
            account,
        });

        const saveCategory = await this.categoriesRepository.save(newCategory);

        return saveCategory;
    }

    async update(id: number, req: UpdateCategoryDto) {
        const result = await this.entityManager.transaction(async (trx) => {
            const {
                title,
                color,
            } = req;

            const findCategory = await trx.findOne(Category, {
                where: { id }, withDeleted: false, 
            });

            if (title) {
                findCategory.title = req.title;
            }

            if (color) {
                findCategory.color = color;
            }

            return await trx.save(findCategory);
        });

        return result.id;
    }

    async sort(req: SortCategoriesDto) {
        await this.entityManager.createQueryBuilder()
            .update(Category)
            .set({ order: () => 'CASE id ' + req.categories.map((c) => `WHEN ${c.id} THEN ${c.order}`).join(' ') + ' END' })
            .where('id IN (:...ids)', { ids: req.categories.map((c) => c.id) })
            .execute();
    }

    async delete(id: number) {
        // FIXME: 此類別下的 todo 將會變成未分類
        return await this.entityManager.transaction(async trx => {
            await trx.softDelete(Category, { id });

            return id;
        });
    }

}

