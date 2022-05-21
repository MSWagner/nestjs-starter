import { Module } from "@nestjs/common";

import { PushTokenController } from "./push-token/push-token.controller";
import { AuthModule } from "../../services/auth/auth.module";
import { PushNotificationModule } from "../../services/push-notification/push-notification.module";

@Module({
    imports: [AuthModule, PushNotificationModule],
    controllers: [PushTokenController],
    providers: []
})
export class PushNotificationApiModule {}
