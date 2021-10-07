import { Strategy } from "passport-http-bearer";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

import { PermissionScope } from "../../../entities/Permission.entity";
import { AuthService } from "../auth.service";

@Injectable()
export class AdminBearerStrategy extends PassportStrategy(Strategy, "admin-bearer") {
    constructor(private readonly authService: AuthService) {
        super();
    }

    async validate(token: string): Promise<any> {
        return this.authService.validateToken(token, [PermissionScope.Admin]);
    }
}
