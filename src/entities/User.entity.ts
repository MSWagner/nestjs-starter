import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

import { RefreshToken } from './RefreshToken.entity';
import { AccessToken } from './AccessToken.entity';
import { UserPermission } from './UserPermission.entity';

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column({ type: 'text', unique: true, nullable: false })
    username: string;

    @Column({ type: 'text', nullable: true, default: null })
    passwordHash: string;

    @Column({ type: 'boolean', default: true })
    isActive: string;

    @OneToMany(type => RefreshToken, refreshToken => refreshToken.user)
    refreshTokens: RefreshToken[];

    @OneToMany(type => AccessToken, accessToken => accessToken.user)
    accessToken: AccessToken[];

    @OneToMany(type => UserPermission, userPermissions => userPermissions.user, { eager: true })
    userPermissions: UserPermission[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
