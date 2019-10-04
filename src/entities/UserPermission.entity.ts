import { BaseEntity, Entity, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { User } from './User.entity';
import { Permission } from './Permission.entity';

@Entity()
export class UserPermission extends BaseEntity {

    @ManyToOne(type => User, user => user.userPermissions, { primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    user: User;

    @ManyToOne(type => Permission, user => user.userPermissions, { primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE', eager: true })
    permission: Permission;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
