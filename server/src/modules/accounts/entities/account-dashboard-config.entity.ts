import { DashboardCardType } from 'src/enums';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Account } from './account.entity';

@Entity()
export class AccountDashboardConfig {
    constructor(data: Partial<AccountDashboardConfig>) {
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
        id: number;

    @Column({ type: 'bigint' })
        account_id: number;

    @Column()
        type: DashboardCardType;

    @Column()
        col: number;

    @Column()
        order: number;

    @Column()
        display: boolean;

    @ManyToOne(() => Account, (account) => account.auths, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'account_id' })
        account: Account;
}

