import { Account } from 'src/modules/accounts/entities/account.entity';
import { Todo } from 'src/modules/todos/entities/todo.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'CategoryDto' })
@Entity()
export class Category {
    constructor(data: Partial<Category>) {
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
    @ApiProperty()
        id: number;

    @Column({
        nullable: false, unique: true, 
    })
    @ApiProperty({ description: 'category title' })
        title: string;
    
    @Column()
    @ApiProperty({ description: 'category sort order' })
        order: number;

    @Column({ nullable: true })
    @ApiProperty({ description: 'category color' })
        color: string | null;

    @CreateDateColumn()
    @ApiProperty()
        create_at: Date;

    @UpdateDateColumn({ default: null })
    @ApiProperty()
        update_at: Date;

    @DeleteDateColumn({ default: null })
    @ApiProperty()
        delete_at: Date;

    @OneToMany(() => Todo, (todo) => todo.category, {
        cascade: true, onDelete: 'CASCADE', 
    })
        todos: Todo[];

    @ManyToOne(() => Account, (account) => account.categories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'account_id' })
        account: Account;
}

