import { Response } from 'express';
import { RequirePermissions } from 'src/decorators/require-permissions.decorators';
import { Permissions } from 'src/enums';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PermissionsGuard } from 'src/middlewares/permissions.guard';

import {
    Controller,
    Get,
    Res,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
} from '@nestjs/swagger';

import { Role } from './entities/role.entity';
import { PrivilegesService } from './privileges.service';

@ApiBearerAuth('Authorization')
@Controller('privileges')
export class PrivilegesController {
    constructor(
        private readonly privilegesService: PrivilegesService,
    ) {}

    @Get('roles')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.privilege.roles.get)
    @ApiOkResponse({ type: [Role] })
    async listRoles(@Res() res: Response<Role[]>) {
        const roles = await this.privilegesService.listRoles();

        return res.json(roles);
    }
}
