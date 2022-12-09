import { Controller, Body, Post, HttpException, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiCreatedResponse } from "@nestjs/swagger";

import { AuthService } from "../../../services/auth/auth.service";
import { RegisterDto, RegisterResponse } from "./_types";

import { CONFIG } from "../../../config";

@ApiTags("auth")
@Controller({ path: "auth/register", version: "1" })
export class RegisterController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    @ApiCreatedResponse({ description: "The user has been successfully created.", type: RegisterResponse })
    async handler(@Body() requestDto: RegisterDto): Promise<RegisterResponse> {
        try {
            const newUser = await this.authService.register(requestDto.username, requestDto.password);
            const tokens = await this.authService.generateToken(newUser);

            return {
                tokenType: "Bearer",
                expiresIn: CONFIG.auth.tokenValidity,
                accessToken: tokens.accessToken.token,
                refreshToken: tokens.refreshToken.token
            };
        } catch (err) {
            throw new HttpException("User with the given username already exists", HttpStatus.CONFLICT);
        }
    }
}
