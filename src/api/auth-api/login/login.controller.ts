import { Controller, Request, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBody, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";

import { AuthService } from "../../../services/auth/auth.service";
import { LoginDto, LoginResponse } from "./_types";

import { CONFIG } from "../../../config";

@ApiTags("auth")
@Controller({ path: "auth/login", version: "1" })
export class LoginController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(AuthGuard("local"))
    @Post()
    @ApiBody({ type: LoginDto })
    @ApiCreatedResponse({ description: "The credentials has been successfully created.", type: LoginResponse })
    async handler(@Request() req) {
        const tokens = await this.authService.login(req.user);

        return {
            tokenType: "Bearer",
            expiresIn: CONFIG.auth.tokenValidity,
            accessToken: tokens.accessToken.token,
            refreshToken: tokens.refreshToken.token
        };
    }
}
