import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

import { PermissionScope } from "../../../entities/Permission.entity";
import { AuthService } from "../auth.service";

@Injectable()
export class AdminLocalStrategy extends PassportStrategy(Strategy, "admin-local") {
    constructor(private readonly authService: AuthService) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(username, password, [PermissionScope.Admin]);

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
