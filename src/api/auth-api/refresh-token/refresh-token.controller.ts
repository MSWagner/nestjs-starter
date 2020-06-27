import * as _ from 'lodash';

import { Controller, Body, Post, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger';

import { AuthService } from '../../../services/auth/auth.service';
import { RefreshTokenDto, RefreshTokenResponse } from './_types';

import { CONFIG } from '../../../configure';

@ApiTags('auth')
@Controller('api/v1/auth/refresh')
export class RefreshTokenController {

    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post()
    @ApiCreatedResponse({ description: 'The credentials has been successfully created.', type: RefreshTokenResponse })
    async handler(@Body() requestDto: RefreshTokenDto) {
        const tokens = await this.authService.refreshAuthToken(requestDto.refreshToken);

        if (_.isNil(tokens)) {
            throw new HttpException('RefreshToken not found.', HttpStatus.NOT_FOUND);
        } else {

            return {
                tokenType: 'Bearer',
                expiresIn: CONFIG.auth.tokenValidity,
                accessToken: tokens.accessToken.token,
                refreshToken: tokens.refreshToken.token
            };
        }
    }
}
