import { Connection, Repository } from "typeorm";
import { RefreshToken } from "../../../entities/RefreshToken.entity";

import CONFIG from "../../../config";
import { AccessToken } from "../../../entities/AccessToken.entity";

export const refreshTokenProviders = [
    {
        provide: CONFIG.database.defaultRefreshTokenRepoName,
        useFactory: (connection: Connection): Repository<AccessToken> => connection.getRepository(RefreshToken),
        inject: [CONFIG.database.defaultConnectionName]
    }
];
