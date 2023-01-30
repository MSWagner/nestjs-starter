import { DataSource } from "typeorm";

import CONFIG from "../../config";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT, 10),
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    entities: [__dirname + "/../../**/*.entity.{ts,js}"],
    migrations: [__dirname + "/../../migrations/*.ts"],
    synchronize: false,
    logging: CONFIG.env.isDevelopment ? ["info"] : false
});

export const DatabaseProvider = {
    provide: CONFIG.database.defaultConnectionName,
    useFactory: async (): Promise<DataSource> => {
        if (AppDataSource.isInitialized) {
            return AppDataSource;
        } else {
            try {
                await AppDataSource.initialize();
                return AppDataSource;
            } catch (error) {
                console.error(error);
            }
        }
    }
};
