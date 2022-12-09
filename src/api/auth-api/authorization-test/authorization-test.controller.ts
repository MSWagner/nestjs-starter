import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { Permissions } from "../../../services/auth/permissions/permission.decorator";
import { PermissionScope } from "../../../entities/Permission.entity";
import { PermissionsGuard } from "../../../services/auth/permissions/permission.guard";

@Controller("/authorization-test")
export class AuthorizationTestController {
    @Get("hello/user")
    @UseGuards(AuthGuard("bearer"), PermissionsGuard)
    @Permissions(PermissionScope.User)
    getHelloUser(): string {
        return "Hello World!";
    }

    @Get("hello/admin")
    @UseGuards(AuthGuard("bearer"), PermissionsGuard)
    @Permissions(PermissionScope.Admin)
    getHelloAdmin(): string {
        return "Hello World!";
    }

    @Get("hello/all")
    @UseGuards(AuthGuard("bearer"), PermissionsGuard)
    @Permissions(PermissionScope.Admin, PermissionScope.User)
    getHelloAll(): string {
        return "Hello World!";
    }
}
