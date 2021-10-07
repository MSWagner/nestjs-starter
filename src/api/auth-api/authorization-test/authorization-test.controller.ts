import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { Permissions } from "../../../services/auth/permissions/permission.decorator";
import { PermissionScope } from "../../../entities/Permission.entity";
import { PermissionsGuard } from "../../../services/auth/permissions/permission.guard";

@UseGuards(AuthGuard("bearer"))
@Controller("/authorization-test")
export class AuthorizationTestController {
    constructor() {}

    @Get("hello/user")
    @UseGuards(PermissionsGuard)
    @Permissions(PermissionScope.Admin)
    getHello(): string {
        return "Hello World!";
    }
}
