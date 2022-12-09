import { Connection, Repository } from "typeorm";
import { AccessToken } from "../../../entities/AccessToken.entity";

import CONFIG from "../../../config";

export const accessTokenProviders = [
    {
        provide: CONFIG.database.defaultAccessTokenRepoName,
        useFactory: (connection: Connection): Repository<AccessToken> => connection.getRepository(AccessToken),
        inject: [CONFIG.database.defaultConnectionName]
    }
];
