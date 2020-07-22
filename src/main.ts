import * as compression from "compression";
import * as helmet from "helmet";
import * as rateLimit from "express-rate-limit";

import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

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

    const options = new DocumentBuilder()
        .addBearerAuth()
        .setTitle("project-name")
        .setDescription("project-name API")
        .setVersion("1.0")
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("api/v1/documentation", app, document);

    await app.listen(3000);
}
bootstrap();
