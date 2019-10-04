import { Module } from '@nestjs/common';

import { AuthModule } from '../../services/auth/auth.module';
import { LoginController } from './login/login.controller';
import { RefreshTokenController } from './refresh-token/refresh-token.controller';
import { RegisterController } from './register/register.controller';

@Module({
    imports: [AuthModule],
    controllers: [LoginController, RefreshTokenController, RegisterController]
})
export class AuthApiModule { }
