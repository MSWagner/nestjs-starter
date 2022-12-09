import { Controller, Request, Post, UseGuards, BadRequestException, Body } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBody, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";

import { PushTokenDto } from "./_types";
import { SuccessResponse } from "../../auth-api/_types";

import { Permissions } from "../../../services/auth/permissions/permission.decorator";
import { PermissionsGuard } from "../../../services/auth/permissions/permission.guard";
import { PermissionScope } from "../../../entities/Permission.entity";

import { PushNotificationService } from "../../../services/push-notification/push-notification.service";

@ApiTags("auth")
@UseGuards(AuthGuard("bearer"), PermissionsGuard)
@Controller({ path: "push-token", version: "1" })
export class PushTokenController {
    constructor(private readonly pushNotificationService: PushNotificationService) {}

    @Post()
    @Permissions(PermissionScope.User, PermissionScope.Admin)
    @ApiBody({ type: PushTokenDto })
    @ApiCreatedResponse({ description: "The push was successful created or updated.", type: SuccessResponse })
    async handler(@Request() req, @Body() requestDto: PushTokenDto): Promise<SuccessResponse> {
        try {
            const pushToken = await this.pushNotificationService.upsertPushToken(requestDto.token, req.user);
            if (!pushToken) {
                throw new BadRequestException();
            }
        } catch (err) {
            throw new BadRequestException();
        }

        return {
            success: true
        };
    }
}
