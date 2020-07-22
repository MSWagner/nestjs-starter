import { Connection } from "typeorm";
import { User } from "../../entities/User.entity";

import CONFIG from "../../configure";

export const userProviders = [
    {
        provide: CONFIG.database.defaultUserRepoName,
        useFactory: (connection: Connection) => connection.getRepository(User),
        inject: [CONFIG.database.defaultConnectionName]
    }
];
