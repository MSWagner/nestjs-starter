import {
    BaseEntity,
    Entity,
    OneToMany,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";

import { UserPermission } from "./UserPermission.entity";

export enum PermissionScope {
    User = "user",
    Admin = "admin"
}

@Entity()
export class Permission extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    uid: string;

    @Column({ unique: true })
    scope: PermissionScope;

    @OneToMany((_type) => UserPermission, (userPermissions) => userPermissions.permission)
    userPermissions: UserPermission[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
