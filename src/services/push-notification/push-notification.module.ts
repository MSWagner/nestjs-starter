import { Module } from "@nestjs/common";

import { pushTokenProviders } from "./providers/push-token.provider";
import { PushNotificationService } from "./push-notification.service";
import { UserModule } from "../user/user.module";

@Module({
    imports: [UserModule],
    providers: [PushNotificationService, ...pushTokenProviders],
    exports: [PushNotificationService]
})
export class PushNotificationModule {}
