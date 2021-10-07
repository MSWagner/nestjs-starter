import { Module } from "@nestjs/common";

import { AuthModule } from "../../services/auth/auth.module";
import { AuthorizationTestController } from "./authorization-test/authorization-test.controller";
import { LoginController } from "./login/login.controller";
import { RefreshTokenController } from "./refresh-token/refresh-token.controller";
import { RegisterController } from "./register/register.controller";

@Module({
    imports: [AuthModule],
    controllers: [LoginController, RefreshTokenController, RegisterController, AuthorizationTestController]
})
export class AuthApiModule {}
