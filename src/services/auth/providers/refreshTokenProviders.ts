import { Connection } from "typeorm";
import { RefreshToken } from "../../../entities/RefreshToken.entity";

import CONFIG from "../../../config";

export const refreshTokenProviders = [
    {
        provide: CONFIG.database.defaultRefreshTokenRepoName,
        useFactory: (connection: Connection) => connection.getRepository(RefreshToken),
        inject: [CONFIG.database.defaultConnectionName]
    }
];
