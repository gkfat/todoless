import { Category } from 'src/modules/categories/entities/categories.entity';
import { Role } from 'src/modules/privileges/entities/role.entity';
import { Todo } from 'src/modules/todos/entities/todo.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

import { AccountAuth } from './account-auth.entity';
import { AccountDashboardConfig } from './account-dashboard-config.entity';

@ApiSchema({ name: 'AccountDto' })
@Entity()
export class Account {
    constructor(account: Partial<Account>) {
        Object.assign(this, account);
    }

    @PrimaryGeneratedColumn()
    @ApiProperty()
        id: number;

    @Column({ unique: true })
    @ApiProperty({ description: 'Unique email' })
        email: string;

    @Column()
    @ApiProperty()
        name: string;

    @Column({ nullable: true })
    @ApiProperty({ description: 'Account avatar image url' })
        avatar: string;

    @Column({ default: false })
    @ApiProperty({ description: 'Account enable status' })
        enabled: boolean;

    @Column({ default: false })
    @ApiProperty({ description: 'Status of account email is verified or not' })
        email_verified: boolean;

    @Column({
        nullable: true, default: null, 
    })
    @ApiProperty()
        last_login_at: Date;

    @CreateDateColumn()
    @ApiProperty()
        create_at: Date;

    @UpdateDateColumn({
        nullable: true, default: null, 
    })
    @ApiProperty()
        update_at: Date;

    @ManyToMany(() => Role, (role) => role.accounts, {
        cascade: true, onDelete: 'CASCADE', 
    })
    @JoinTable({ name: 'account_role' })
    @ApiProperty({ type: [Role] })
        roles: Role[];

    @OneToMany(() => AccountDashboardConfig, (config) => config.account, {
        cascade: true, onDelete: 'CASCADE', 
    })
        dashboard_configs: AccountDashboardConfig[];

    @OneToMany(() => AccountAuth, (auth) => auth.account, {
        cascade: true, onDelete: 'CASCADE', 
    })
        auths: AccountAuth[];

    @OneToMany(() => Category, (category) => category.account, {
        cascade: true, onDelete: 'CASCADE', 
    })
        categories: Category[];

    @OneToMany(() => Todo, (todo) => todo.account, {
        cascade: true, onDelete: 'CASCADE', 
    })
        todos: Todo[];
}

