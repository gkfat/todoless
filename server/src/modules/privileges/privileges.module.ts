import { MiddlewaresModule } from 'src/middlewares/middlewares.module';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from './entities/role.entity';
import { PrivilegesController } from './privileges.controller';
import { PrivilegesService } from './privileges.service';

@Module({
    imports: [MiddlewaresModule, TypeOrmModule.forFeature([Role])],
    controllers: [PrivilegesController],
    providers: [PrivilegesService],
    exports: [],
})
export class PrivilegesModule {
}
