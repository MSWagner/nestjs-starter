import { BaseEntity, Entity, OneToMany, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { UserPermission } from './UserPermission.entity';

export type PermissionScope = 'user' | 'admin';

@Entity()
export class Permission extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column({ unique: true })
    scope: PermissionScope;

    @OneToMany(type => UserPermission, userPermissions => userPermissions.permission)
    userPermissions: UserPermission[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
