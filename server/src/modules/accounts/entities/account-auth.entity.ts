import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Account } from './account.entity';

@Entity()
export class AccountAuth {
    constructor(auth: Partial<AccountAuth>) {
        Object.assign(this, auth);
    }

    @PrimaryGeneratedColumn()
        id: number;

    @Column({ type: 'bigint' })
        account_id: number;

    @Column()
        type: string;

    @Column({ length: 255 })
        identifier: string;

    @Column({
        length: 1024, nullable: true,  
    })
        credential?: string;

    @ManyToOne(() => Account, (account) => account.auths, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'account_id' })
        account: Account;
}

