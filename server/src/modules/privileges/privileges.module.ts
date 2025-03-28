import { MiddlewaresModule } from 'src/middlewares/middlewares.module';

import { Module } from '@nestjs/common';

import { PrivilegesController } from './privileges.controller';
import { PrivilegesService } from './privileges.service';

@Module({
    imports: [MiddlewaresModule],
    controllers: [PrivilegesController],
    providers: [PrivilegesService],
    exports: [],
})
export class PrivilegesModule {
}
