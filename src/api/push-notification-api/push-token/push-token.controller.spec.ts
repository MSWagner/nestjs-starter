import request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";

import { setupApp } from "../../../appSetup";

import { TestModule } from "../../../services/test/test.module";
import { TestService } from "../../../services/test/test.service";
import { AuthModule } from "../../../services/auth/auth.module";

import { PushTokenController } from "./push-token.controller";
import { PushNotificationModule } from "../../../services/push-notification/push-notification.module";

import * as fixtures from "../../../services/test/fixtures";

describe("PushTokenController", () => {
    let app: INestApplication;
    let testService: TestService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PushTokenController],
            imports: [TestModule, PushNotificationModule, AuthModule]
        }).compile();

        testService = module.get<TestService>(TestService);

        app = module.createNestApplication();
        await setupApp(app);
        await app.init();
    });

    beforeEach(async () => {
        await testService.reloadFixtures();
    });

    afterAll((done) => {
        testService.connectionManager.connection.close();
        done();
    });

    it("### PermissionGuard - should return 401 for no access", async () => {
        const body = {
            token: "testToken"
        };

        const response = await request(app.getHttpServer()).post("/api/v1/push-token").send(body).expect(401);
        expect(response.body).toMatchSnapshot("NoPermissionsUserOrAdmin");
    });

    it("### PermissionGuard - should return success with admin permission", async () => {
        const body = {
            token: "testToken"
        };

        const response = await request(app.getHttpServer())
            .post("/api/v1/push-token")
            .auth(fixtures.accessTokenUser3Admin.token, { type: "bearer" })
            .send(body)
            .expect(201);
        expect(response.text).toMatchSnapshot("Success");
    });

    it("### PermissionGuard - should return success with user permission", async () => {
        const body = {
            token: "testToken"
        };

        const response = await request(app.getHttpServer())
            .post("/api/v1/push-token")
            .auth(fixtures.accessToken1.token, { type: "bearer" })
            .send(body)
            .expect(201);
        expect(response.text).toMatchSnapshot("Success");
    });

    it("### should return 400er for push token conflict", async () => {
        const body = {
            token: fixtures.user3PushToken
        };

        const response = await request(app.getHttpServer())
            .post("/api/v1/push-token")
            .auth(fixtures.accessToken1.token, { type: "bearer" })
            .send(body)
            .expect(400);
        expect(response.text).toMatchSnapshot("BadRequestTokenConflict");
    });

    it("### should return 400er for to short push token", async () => {
        const body = {
            token: "12"
        };

        const response = await request(app.getHttpServer())
            .post("/api/v1/push-token")
            .auth(fixtures.accessToken1.token, { type: "bearer" })
            .send(body)
            .expect(400);
        expect(response.text).toMatchSnapshot("BadRequestShortToken");
    });

    it("### should return 400er for missing token", async () => {
        const body = {};

        const response = await request(app.getHttpServer())
            .post("/api/v1/push-token")
            .auth(fixtures.accessToken1.token, { type: "bearer" })
            .send(body)
            .expect(400);
        expect(response.text).toMatchSnapshot("BadRequestMissingToken");
    });
});
