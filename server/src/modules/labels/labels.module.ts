import { MiddlewaresModule } from 'src/middlewares/middlewares.module';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountsModule } from '../accounts/accounts.module';
import { Label } from './entities/label.entity';
import { LabelsController } from './labels.controller';
import { LabelsService } from './labels.service';

@Module({
    imports: [
        AccountsModule,
        MiddlewaresModule,
        TypeOrmModule.forFeature([Label]),
    ],
    controllers: [LabelsController],
    providers: [LabelsService],
    exports: [LabelsService],
})
export class LabelsModule {}
