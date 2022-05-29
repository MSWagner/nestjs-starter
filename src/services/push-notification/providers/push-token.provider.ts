import { Connection } from "typeorm";
import { PushToken } from "../../../entities/PushToken.entity";

import CONFIG from "../../../config";

export const pushTokenProviders = [
    {
        provide: CONFIG.database.defaultPushTokenRepoName,
        useFactory: (connection: Connection) => connection.getRepository(PushToken),
        inject: [CONFIG.database.defaultConnectionName]
    }
];
