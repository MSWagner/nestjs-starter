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
export class PushToken extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    uid: string;

    @Column({ type: "text", unique: true, nullable: false })
    token: string;

    @ManyToOne((_type) => User, (user) => user.pushTokens, {
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
