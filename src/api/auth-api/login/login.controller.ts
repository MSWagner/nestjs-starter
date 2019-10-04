import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiImplicitBody, ApiCreatedResponse, ApiUseTags } from '@nestjs/swagger';

import { AuthService } from '../../../services/auth/auth.service';
import { LoginDto, LoginResponse } from './_types';

import { CONFIG } from '../../../configure';
@ApiUseTags('auth')
@Controller('api/v1/auth/login')
export class LoginController {

    constructor(
        private readonly authService: AuthService,
    ) { }

    @UseGuards(AuthGuard('local'))
    @Post()
    @ApiImplicitBody({ name: 'LoginDto', type: LoginDto })
    @ApiCreatedResponse({ description: 'The credentials has been successfully created.', type: LoginResponse })
    async handler(@Request() req) {
        const tokens = await this.authService.login(req.user);

        return {
            tokenType: 'Bearer',
            expiresIn: CONFIG.auth.tokenValidity,
            accessToken: tokens.accessToken.token,
            refreshToken: tokens.refreshToken.token
        };
    }
}
