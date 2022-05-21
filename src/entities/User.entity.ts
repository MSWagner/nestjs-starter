import {
    BaseEntity,
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from "typeorm";

import { RefreshToken } from "./RefreshToken.entity";
import { AccessToken } from "./AccessToken.entity";
import { UserPermission } from "./UserPermission.entity";
import { PermissionScope } from "./Permission.entity";
import { PushToken } from "./PushToken.entity";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    uid: string;

    @Column({ type: "text", unique: true, nullable: false })
    username: string;

    @Column({ type: "text", nullable: true, default: null })
    passwordHash: string;

    @Column({ type: "boolean", default: false })
    isActive: boolean;

    @OneToMany((_type) => RefreshToken, (refreshToken) => refreshToken.user)
    refreshTokens: RefreshToken[];

    @OneToMany((_type) => AccessToken, (accessToken) => accessToken.user)
    accessToken: AccessToken[];

    @OneToMany((_type) => UserPermission, (userPermissions) => userPermissions.user, { eager: true })
    userPermissions: UserPermission[];

    @OneToMany((_type) => PushToken, (pushToken) => pushToken.user, { eager: true })
    pushTokens: UserPermission[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    get permissions(): PermissionScope[] {
        return this.userPermissions.map((userPermission) => userPermission.permission.scope);
    }
}
