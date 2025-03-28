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

@ApiSchema({ name: 'LabelDto' })
@Entity()
export class Label {
    constructor(data: Partial<Label>) {
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
    @ApiProperty()
        id: number;

    @Column({
        nullable: false, unique: true, 
    })
    @ApiProperty({ description: 'Title of a label' })
        title: string;
    
    @Column()
    @ApiProperty({ description: 'Sort order of a label' })
        order: number;

    @Column({ nullable: true })
    @ApiProperty({ description: 'Color of a label' })
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

    @OneToMany(() => Todo, (todo) => todo.label, {
        cascade: true, onDelete: 'CASCADE', 
    })
        todos: Todo[];

    @ManyToOne(() => Account, (account) => account.labels, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'account_id' })
        account: Account;
}

