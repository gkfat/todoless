import { Account } from 'src/modules/accounts/entities/account.entity';
import { Category } from 'src/modules/categories/entities/categories.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
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
        type: 'date', default: null, 
    })
    @ApiProperty({ description: 'Completed status of a todo' })
        completed_at: Date;

    @CreateDateColumn()
    @ApiProperty()
        create_at: Date;

    @UpdateDateColumn({ default: null })
    @ApiProperty()
        update_at: Date;

    @DeleteDateColumn({ default: null })
    @ApiProperty()
        delete_at: Date;

    @ManyToOne(() => Category, (category) => category.todos, {
        nullable: true, onDelete: 'CASCADE', 
    })
    @JoinColumn({ name: 'category_id' })
        category: Category | null;

    @ManyToOne(() => Account, (account) => account.todos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'account_id' })
        account: Account;
}

