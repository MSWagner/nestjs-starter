import {
    BaseEntity,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column
} from "typeorm";
import { User } from "./User.entity";

@Entity()
export class AccessToken extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    token: string;

    @Column({})
    validUntil: Date;

    @ManyToOne((_type) => User, (user) => user.accessToken, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        nullable: false
    })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
