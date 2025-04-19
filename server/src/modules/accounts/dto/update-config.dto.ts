import {
    IsArray,
    IsBoolean,
    IsNumber,
    IsString,
} from 'class-validator';
import { DashboardCardType } from 'src/enums';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

import { AccountDashboardConfig } from '../entities/account-dashboard-config.entity';

@ApiSchema({ name: 'DashboardConfig' })
export class DashboardConfigDto {
    @IsString()
    @ApiProperty({ enum: DashboardCardType })
        type: DashboardCardType;

    @IsNumber()
    @ApiProperty()
        col: 1 | 2;

    @IsNumber()
    @ApiProperty()
        order: number;

    @IsBoolean()
    @ApiProperty()
        display: boolean;
}

@ApiSchema({ name: 'UpdateConfigRequest' })
export class UpdateConfigDto {
    @IsArray()
    @ApiProperty({ type: [DashboardConfigDto] })
        dashboardConfigs: DashboardConfigDto[];
}

@ApiSchema({ name: 'UpdateConfigResponse' })
export class UpdateConfigResponseDto {
    @IsArray()
    @ApiProperty({ type: [AccountDashboardConfig] })
        dashboardConfigs: AccountDashboardConfig[];
}
