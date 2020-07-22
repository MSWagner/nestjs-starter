module.exports = {
    type: "postgres",
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT, 10),
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    migrations: ["src/migrations/*.ts"],
    cli: { migrationsDir: "src/migrations" },
    entities: ["src/entities/**/*.entity.{ts,js}"]
};
