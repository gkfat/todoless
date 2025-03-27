import {
    EntityManager,
    Repository,
} from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Role } from './entities/role.entity';

@Injectable()
export class PrivilegesService {
    constructor(
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
        private readonly entityManager: EntityManager,
    ) {}

    async listRoles() {
        return await this.rolesRepository.find();
    }
}

