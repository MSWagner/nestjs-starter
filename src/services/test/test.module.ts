import { Module } from "@nestjs/common";

import { TestService } from "./test.service";
import { DatabaseModule } from "../database/database.module";

@Module({
    imports: [DatabaseModule],
    providers: [TestService],
    exports: [TestService, DatabaseModule]
})
export class TestModule {}
