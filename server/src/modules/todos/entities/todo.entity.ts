import { Account } from 'src/modules/accounts/entities/account.entity';
import { Category } from 'src/modules/categories/entities/categories.entity';
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
@Index(['order', 'category'], { unique: true }) // 同個類別內排序為唯一值
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

    @Column({ default: false })
    @ApiProperty({ description: 'Completed status of a todo' })
        completed: boolean;

    @CreateDateColumn()
    @ApiProperty()
        create_at: Date;

    @UpdateDateColumn({ default: null })
    @ApiProperty()
        update_at: Date;

    @DeleteDateColumn({ default: null })
    @ApiProperty()
        delete_at: Date;

    @ManyToOne(() => Category, (category) => category.todos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'category_id' })
        category: Category;

    @ManyToOne(() => Account, (account) => account.todos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'account_id' })
        account: Account;
}

