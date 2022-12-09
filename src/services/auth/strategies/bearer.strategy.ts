import { Strategy } from "passport-http-bearer";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

import { AuthService } from "../auth.service";
import { User } from "../../../entities/User.entity";

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super();
    }

    async validate(token: string): Promise<User> {
        return this.authService.validateToken(token);
    }
}
