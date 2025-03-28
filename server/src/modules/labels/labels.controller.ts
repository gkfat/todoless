import { Response } from 'express';
import { RequirePermissions } from 'src/decorators/require-permissions.decorators';
import {
    $TokenPayload,
    ITokenPayload,
} from 'src/decorators/token-payload.decorators';
import { Permissions } from 'src/enums';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PermissionsGuard } from 'src/middlewares/permissions.guard';

import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
} from '@nestjs/swagger';

import { AccountsService } from '../accounts/accounts.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { SortLabelsDto } from './dto/sort-labels.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { Label } from './entities/label.entity';
import { LabelsService } from './labels.service';

@ApiBearerAuth('Authorization')
@Controller('labels')
export class LabelsController {
    constructor(
        private readonly labelsService: LabelsService,
        private readonly accountsService: AccountsService,
    ) {}

    @Get()
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.label.labels.get)
    @ApiOkResponse({ type: [Label] })
    async list(
        @$TokenPayload() payload: ITokenPayload | null,
        @Res() res: Response<Label[]>,
    ) {
        const { scope: { sub } } = payload;

        const rs = await this.labelsService.findAllByAccountId(+sub);

        return res.json(rs);
    }

    @Post('create')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.label.labels.add)
    @ApiOkResponse({ type: Label })
    async createLabel(
        @$TokenPayload() payload: ITokenPayload | null,
        @Body() reqBody: CreateLabelDto,
        @Res() res: Response<Label>,
    ) {
        const { scope: { sub } } = payload;

        const account = await this.accountsService.findOne(+sub);
        const rs = await this.labelsService.create(account, reqBody);

        return res.json(rs);
    }

    @Put(':id/update')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.label.labels.update)
    @ApiOkResponse({ type: Label })
    async update(
        @$TokenPayload() payload: ITokenPayload,
        @Param('id') id: string,
        @Body() reqBody: UpdateLabelDto,
        @Res() res: Response<Label>,
    ) {
        const { scope: { sub } } = payload;

        const findLabel = await this.labelsService.findOne(+id);

        if (findLabel.account.id !== sub) {
            throw new UnauthorizedException('Unauthorized to update this label');
        }

        const labelId = await this.labelsService.update(+id, reqBody);
        const rs = await this.labelsService.findOne(labelId);
        
        return res.json(rs);
    }

    @Post('sort')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.label.labels.update)
    @ApiOkResponse({ type: [Label] })
    async sortLabels(
        @$TokenPayload() payload: ITokenPayload | null,
        @Body() reqBody: SortLabelsDto,
        @Res() res: Response<Label[]>,
    ) {
        const { scope: { sub } } = payload;
        const findAllLabels = await this.labelsService.findAllByAccountId(+sub);

        reqBody.labels.forEach((label)=> {
            const labelExist = findAllLabels.find((v) => v.account.id === label.accountId && v.id === label.id);

            if (!labelExist) {
                throw new BadRequestException(`not exist label ${label.id}`);
            }
        });

        const rs = await this.labelsService.sortLabels(reqBody);

        return res.json(rs);
    }

    @Delete(':id')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.label.labels.delete)
    @ApiOkResponse({ type: Number })
    async deleteAccount(
        @$TokenPayload() payload: ITokenPayload,
        @Param('id') id: string,
        @Res() res: Response<number>,
    ) {
        const { scope: { sub } } = payload;

        const findLabel = await this.labelsService.findOne(+id);

        if (findLabel.account.id !== sub) {
            throw new UnauthorizedException('Unauthorized to update this label');
        }

        const rs = await this.labelsService.delete(+id);

        return res.json(rs);
    }
}
