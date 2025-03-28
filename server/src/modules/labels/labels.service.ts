import {
    EntityManager,
    Repository,
} from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Account } from '../accounts/entities/account.entity';
import { CreateLabelDto } from './dto/create-label.dto';
import { SortLabelsDto } from './dto/sort-labels.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { Label } from './entities/label.entity';

@Injectable()
export class LabelsService {

    constructor(
        @InjectRepository(Label)
        private readonly labelRepository: Repository<Label>,
        private readonly entityManager: EntityManager,
    ) {}
    
    async findAllByAccountId(accountId: number) {
        const res = await this.entityManager.find(Label, {
            where: { account: { id: accountId } },
            relations: {
                account: true,  todos: true, 
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
            order: { order: 'ASC' },
        });
        
        return res;
    }

    async findOne(id: number) {
        const res = await this.entityManager.findOne(Label, {
            where: { id },
            relations: {
                account: true, todos: true, 
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

    async create(account: Account, req: CreateLabelDto) {
        const getMaxOrder = await this.labelRepository
            .createQueryBuilder('label')
            .where('label.account_id = :accountId', { accountId: account.id })
            .select('MAX(label.order)', 'maxOrder')
            .getRawOne();

        const newOrder = (getMaxOrder?.maxOrder ?? 0) + 1;

        const newLabel = this.labelRepository.create({
            ...req,
            order: newOrder,
            account,
        });

        const saveLabel = await this.labelRepository.save(newLabel);

        return saveLabel;
    }

    async update(id: number, req: UpdateLabelDto) {
        const result = await this.entityManager.transaction(async (trx) => {
            const findLabel = await trx.findOne(Label, {
                where: { id }, withDeleted: false, 
            });

            findLabel.title = req.title;

            if (req.color) {
                findLabel.color = req.color;
            }

            return await trx.save(findLabel);
        });

        return result.id;
    }

    async sortLabels(req: SortLabelsDto) {
        return await this.entityManager.transaction(async (trx) => {
            await trx
                .createQueryBuilder()
                .update(Label)
                .set({ order: () => 'CASE id ' + req.labels.map((l) => `WHEN ${l.id} THEN ${l.order}`).join(' ') + ' END' })
                .where('id IN (:...ids)', { ids: req.labels.map((l) => l.id) })
                .execute();

            const accountId = req.labels[0].accountId;

            return await trx.find(Label, {
                where: { account: { id: accountId } },
                relations: { account: true },
                withDeleted: false,
                order: { order: 'ASC' },
            });
        });
    }

    async delete(id: number) {
        // FIXME: 此標籤下的 todo 將會失去標籤
        return await this.entityManager.transaction(async trx => {
            await trx.softDelete(Label, { id });

            return id;
        });
    }

}

