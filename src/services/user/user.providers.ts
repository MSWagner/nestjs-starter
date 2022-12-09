import { Connection, Repository } from "typeorm";
import { User } from "../../entities/User.entity";

import CONFIG from "../../config";

export const userProviders = [
    {
        provide: CONFIG.database.defaultUserRepoName,
        useFactory: (connection: Connection): Repository<User> => connection.getRepository(User),
        inject: [CONFIG.database.defaultConnectionName]
    }
];
