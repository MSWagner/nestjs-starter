import request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";

import { setupApp } from "../../../appSetup";

import { TestModule } from "../../../services/test/test.module";
import { TestService } from "../../../services/test/test.service";
import { RefreshTokenController } from "./refresh-token.controller";
import { AuthModule } from "../../../services/auth/auth.module";

import { AccessToken } from "../../../entities/AccessToken.entity";
import { RefreshToken } from "../../../entities/RefreshToken.entity";

import * as fixtures from "../../../services/test/fixtures";

describe("RefreshToken Controller", () => {
    let app: INestApplication;
    let testService: TestService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RefreshTokenController],
            imports: [TestModule, AuthModule]
        }).compile();

        testService = module.get<TestService>(TestService);

        app = module.createNestApplication();
        setupApp(app);
        await app.init();
    });

    beforeEach(async () => {
        await testService.reloadFixtures();
    });

    afterAll((done) => {
        testService.connectionManager.connection.close();
        done();
    });

    it("/POST auth/refresh - should refresh the accessToken for user1", async () => {
        const body = {
            refreshToken: fixtures.refreshToken1.token
        };

        const refreshTokenCountBefore = await RefreshToken.count({ token: body.refreshToken });
        expect(refreshTokenCountBefore).toEqual(1);

        const accessTokenCountBefore = await AccessToken.count({ user: fixtures.user1 });
        expect(accessTokenCountBefore).toEqual(1);

        const response = await request(app.getHttpServer()).post("/api/v1/auth/refresh").send(body).expect(201);

        const refreshTokenCountAfter = await RefreshToken.count({ token: body.refreshToken });
        expect(refreshTokenCountAfter).toEqual(1);

        const accessTokenCountAfter = await AccessToken.count({ user: fixtures.user1 });
        expect(accessTokenCountAfter).toEqual(accessTokenCountBefore + 1);

        const credentials = testService.replaceValues(response.body, ["UUID", "DATE"]);
        expect(credentials).toMatchSnapshot("RefreshTokenCredentials");
    });

    it("/POST auth/refresh - should throw error for missing token", async () => {
        const body = {};

        const response = await request(app.getHttpServer()).post("/api/v1/auth/refresh").send(body).expect(400);

        const responseBody = testService.replaceValues(response.body, ["UUID", "DATE"]);
        expect(responseBody).toMatchSnapshot("MissingTokenError");
    });

    it("/POST auth/refresh - should throw error for wrong token format (not a UUID)", async () => {
        const body = {
            refreshToken: "notAUUID"
        };

        const response = await request(app.getHttpServer()).post("/api/v1/auth/refresh").send(body).expect(400);

        const responseBody = testService.replaceValues(response.body, ["UUID", "DATE"]);
        expect(responseBody).toMatchSnapshot("NoUUIDTokenError");
    });

    it("/POST auth/refresh - should throw error not existing refreshToken", async () => {
        const body = {
            refreshToken: "6b910a84-69ea-4347-969c-6c33aef95550"
        };

        const response = await request(app.getHttpServer()).post("/api/v1/auth/refresh").send(body).expect(404);

        const responseBody = testService.replaceValues(response.body, ["UUID", "DATE"]);
        expect(responseBody).toMatchSnapshot("NotFoundRefreshTokenError");
    });
});
