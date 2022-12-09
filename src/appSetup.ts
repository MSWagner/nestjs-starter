import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { INestApplication, ValidationPipe, VersioningType } from "@nestjs/common";

export async function setupApp(app: INestApplication): Promise<void> {
    app.setGlobalPrefix("api");
    app.enableVersioning({
        type: VersioningType.URI
    });

    app.use(compression());
    app.use(helmet());
    app.enableCors();
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100 // limit each IP to 100 requests per windowMs
        })
    );

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
}
