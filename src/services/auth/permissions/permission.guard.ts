import * as _ from "lodash";
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { PermissionScope } from "../../../entities/Permission.entity";
import { PERMISSION_KEY } from "./permission.decorator";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<PermissionScope[]>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!requiredPermissions) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();

        if (_.isNil(user)) {
            throw new UnauthorizedException();
        }

        return requiredPermissions.some((permission) => user.permissions?.includes(permission));
    }
}
