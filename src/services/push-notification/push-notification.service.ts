import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

import { PushToken } from "../../entities/PushToken.entity";
import { User } from "../../entities/User.entity";

import CONFIG from "../../config";

@Injectable()
export class PushNotificationService {
    constructor(
        @Inject(CONFIG.database.defaultPushTokenRepoName)
        private readonly pushTokenRepository: Repository<PushToken>
    ) {}

    async upsertPushToken(token: string, user: User): Promise<PushToken | null> {
        let pushToken = await PushToken.findOne({ where: { user: user.uid } });
        if (!pushToken) {
            pushToken = new PushToken();
            pushToken.user = user;
        }

        pushToken.token = token;

        try {
            pushToken = await this.pushTokenRepository.save(pushToken);
            return pushToken;
        } catch (error) {
            return null;
        }
    }
}
