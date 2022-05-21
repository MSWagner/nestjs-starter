import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { DatabaseModule } from "./services/database/database.module";
import { AuthApiModule } from "./api/auth-api/auth-api.module";
import { PushNotificationModule } from "./services/push-notification/push-notification.module";
import { PushNotificationApiModule } from "./api/push-notification-api/push-notification-api.module";

@Module({
    imports: [DatabaseModule, AuthApiModule, PushNotificationModule, PushNotificationApiModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
