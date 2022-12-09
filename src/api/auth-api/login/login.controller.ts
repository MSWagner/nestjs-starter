import { Controller, Request, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBody, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";

import { AuthService } from "../../../services/auth/auth.service";
import { LoginDto, LoginResponse } from "./_types";

import { CONFIG } from "../../../config";

import { Permissions } from "../../../services/auth/permissions/permission.decorator";
import { PermissionsGuard } from "../../../services/auth/permissions/permission.guard";
import { PermissionScope } from "../../../entities/Permission.entity";

@ApiTags("auth")
@UseGuards(AuthGuard("local"))
@Controller({ path: "auth/login", version: "1" })
export class LoginController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    @UseGuards(PermissionsGuard)
    @Permissions(PermissionScope.User)
    @ApiBody({ type: LoginDto })
    @ApiCreatedResponse({ description: "The credentials has been successfully created.", type: LoginResponse })
    async handler(@Request() req): Promise<LoginResponse> {
        const tokens = await this.authService.login(req.user);

        return {
            tokenType: "Bearer",
            expiresIn: CONFIG.auth.tokenValidity,
            accessToken: tokens.accessToken.token,
            refreshToken: tokens.refreshToken.token
        };
    }
}
