import { BaseEntity, Entity, ManyToOne, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from "typeorm";

import { User } from "./User.entity";
import { Permission } from "./Permission.entity";

@Entity()
export class UserPermission extends BaseEntity {
    @PrimaryColumn({ type: "uuid" })
    userUid: string;

    @PrimaryColumn({ type: "uuid" })
    permissionUid: string;

    @ManyToOne((_type) => User, (user) => user.userPermissions, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    user: User;

    @ManyToOne((_type) => Permission, (user) => user.userPermissions, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        eager: true
    })
    permission: Permission;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
