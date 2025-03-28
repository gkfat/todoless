import { EnumTodoStatus } from 'src/enums/todo-status.enum';
import { Account } from 'src/modules/accounts/entities/account.entity';
import { Label } from 'src/modules/labels/entities/label.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'TodoDto' })
@Entity()
@Index(['order', 'label'], { unique: true }) // 同個標籤內排序為唯一值
export class Todo {
    constructor(data: Partial<Todo>) {
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
    @ApiProperty()
        id: number;

    @Column({ nullable: false })
    @ApiProperty({ description: 'Sort order of a todo' })
        order: number;

    @Column({ nullable: false })
    @ApiProperty({ description: 'Title of a todo' })
        title: string;

    @Column({ nullable: true })
    @ApiProperty({ description: 'Due date of a todo' })
        due_date: Date;

    @Column({
        type: 'enum', enum: EnumTodoStatus, default: EnumTodoStatus.NEW, 
    })
    @ApiProperty({ description: 'Status of a todo' })
        status: EnumTodoStatus;

    @CreateDateColumn()
    @ApiProperty()
        create_at: Date;

    @UpdateDateColumn({ default: null })
    @ApiProperty()
        update_at: Date;

    @DeleteDateColumn({ default: null })
    @ApiProperty()
        delete_at: Date;

    @ManyToOne(() => Label, (label) => label.todos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'label_id' })
        label: Label;

    @ManyToOne(() => Account, (account) => account.todos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'account_id' })
        account: Account;
}

