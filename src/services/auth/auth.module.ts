import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';

import { LocalStrategy } from './strategies/local.strategy';
import { BearerStrategy } from './strategies/bearer.strategy';
import { AdminStrategy } from './strategies/admin.strategy';

import { UserModule } from '../user/user.module';

import { PassportModule } from '@nestjs/passport';

import { accessTokenProviders } from './providers/accessTokenProviders';
import { refreshTokenProviders } from './providers/refreshTokenProviders';

@Module({
    imports: [
        UserModule,
        PassportModule,
    ],
    providers: [AuthService, LocalStrategy, BearerStrategy, AdminStrategy, ...accessTokenProviders, ...refreshTokenProviders],
    exports: [AuthService],
})
export class AuthModule { }
