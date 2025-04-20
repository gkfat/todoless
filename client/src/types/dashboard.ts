import { DashboardCardType } from '../enums/dashboard';

export interface DashboardConfig {
    type: DashboardCardType;
    col: 1 | 2;
    order: number;
    display: boolean;
}

