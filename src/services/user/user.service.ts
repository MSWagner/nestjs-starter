import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { Injectable, Inject } from "@nestjs/common";

import { User } from "../../entities/User.entity";

import CONFIG from "../../config";

@Injectable()
export class UserService {
    private saltRounds = 10;

    constructor(
        @Inject(CONFIG.database.defaultUserRepoName)
        private readonly userRepository: Repository<User>
    ) {}

    private async getHash(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async findOne(username: string): Promise<User | undefined> {
        return this.userRepository.findOne({ username }, { relations: ["userPermissions"] });
    }

    async createUser(username: string, password: string): Promise<User> {
        const user = new User();

        user.username = username;
        user.passwordHash = await this.getHash(password);

        return this.userRepository.save(user);
    }
}
