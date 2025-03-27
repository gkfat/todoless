import { EnumRole } from 'src/enums';
import { Account } from 'src/modules/accounts/entities/account.entity';
import {
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'RoleDto' })
@Entity()
export class Role {
    constructor(role: Partial<Role>) {
        Object.assign(this, role);
    }

    @PrimaryGeneratedColumn()
    @ApiProperty()
        id: number;

    @Column({
        unique: true, type: 'enum', enum: EnumRole, 
    })
    @ApiProperty({ enum: EnumRole })
        role: EnumRole;

    @ManyToMany(() => Account, (account) => account.roles)
        accounts: Account[];
}