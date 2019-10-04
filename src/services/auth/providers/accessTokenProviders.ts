import { Connection } from 'typeorm';
import { AccessToken } from '../../../entities/AccessToken.entity';

import CONFIG from '../../../configure';

export const accessTokenProviders = [
  {
    provide: CONFIG.database.defaultAccessTokenRepoName,
    useFactory: (connection: Connection) => connection.getRepository(AccessToken),
    inject: [CONFIG.database.defaultConnectionName],
  },
];
