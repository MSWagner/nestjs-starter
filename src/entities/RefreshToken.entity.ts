import { BaseEntity, Entity, ManyToOne, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User.entity';

@Entity()
export class RefreshToken extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    token: string;

    @Column({ nullable: true })
    validUntil: Date;

    @ManyToOne(type => User, user => user.refreshTokens, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
