import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { userProviders } from "./user.providers";

import { DatabaseModule } from "../database/database.module";

@Module({
    imports: [DatabaseModule],
    providers: [...userProviders, UserService],
    exports: [DatabaseModule, UserService, ...userProviders]
})
export class UserModule {}
