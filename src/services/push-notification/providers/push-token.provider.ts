import { Connection, Repository } from "typeorm";
import { PushToken } from "../../../entities/PushToken.entity";

import CONFIG from "../../../config";

export const pushTokenProviders = [
    {
        provide: CONFIG.database.defaultPushTokenRepoName,
        useFactory: (connection: Connection): Repository<PushToken> => connection.getRepository(PushToken),
        inject: [CONFIG.database.defaultConnectionName]
    }
];
