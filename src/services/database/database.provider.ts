import { Connection, createConnection, getConnection, getConnectionManager } from "typeorm";

import CONFIG from "../../config";

export const DatabaseProvider = {
    provide: CONFIG.database.defaultConnectionName,
    useFactory: async (): Promise<Connection> => {
        try {
            return getConnection();
        } catch (error) {
            // If AlreadyHasActiveConnectionError occurs, return already existent connection
            if (error.name === "AlreadyHasActiveConnectionError") {
                const existentConn = getConnectionManager().get("default");
                return existentConn;
            }

            return createConnection({
                type: "postgres",
                host: process.env.PGHOST,
                port: parseInt(process.env.PGPORT, 10),
                username: process.env.PGUSER,
                password: process.env.PGPASSWORD,
                database: process.env.PGDATABASE,
                entities: [__dirname + "/../../**/*.entity.{ts,js}"],
                migrations: [__dirname + "/../../migrations/*.ts"],
                cli: { migrationsDir: `${__dirname + "/../../migrations"}` },
                synchronize: false,
                logging: CONFIG.env.isDevelopment ? ["info"] : false
            });
        }
    }
};
