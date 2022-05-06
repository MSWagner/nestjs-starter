import request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";

import { setupApp } from "../../../appSetup";

import { TestModule } from "../../../services/test/test.module";
import { TestService } from "../../../services/test/test.service";
import { LoginController } from "./login.controller";
import { AuthModule } from "../../../services/auth/auth.module";

import { AccessToken } from "../../../entities/AccessToken.entity";
import { RefreshToken } from "../../../entities/RefreshToken.entity";

import * as fixtures from "../../../services/test/fixtures";

describe("Login Controller", () => {
    let app: INestApplication;
    let testService: TestService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LoginController],
            imports: [TestModule, AuthModule]
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

    it("/POST auth/login - should login user1", async () => {
        const body = {
            username: fixtures.user1.username,
            password: "testPassword"
        };

        const refreshTokenCountBefore = await RefreshToken.count({ user: fixtures.user1 });
        expect(refreshTokenCountBefore).toEqual(1);

        const accessTokenCountBefore = await AccessToken.count({ user: fixtures.user1 });
        expect(accessTokenCountBefore).toEqual(1);

        const response = await request(app.getHttpServer()).post("/api/v1/auth/login").send(body).expect(201);

        const refreshTokenCountAfter = await RefreshToken.count({ user: fixtures.user1 });
        expect(refreshTokenCountAfter).toEqual(refreshTokenCountBefore + 1);

        const accessTokenCountAfter = await AccessToken.count({ user: fixtures.user1 });
        expect(accessTokenCountAfter).toEqual(accessTokenCountBefore + 1);

        const credentials = testService.replaceValues(response.body, ["UUID", "DATE"]);
        expect(credentials).toMatchSnapshot("LoginUser1");
    });

    it("/POST auth/login - should throw error for missing username", async () => {
        const body = {
            password: "testPassword"
        };

        const refreshTokenCountBefore = await RefreshToken.count({ user: fixtures.user1 });
        expect(refreshTokenCountBefore).toEqual(1);

        const accessTokenCountBefore = await AccessToken.count({ user: fixtures.user1 });
        expect(accessTokenCountBefore).toEqual(1);

        const response = await request(app.getHttpServer()).post("/api/v1/auth/login").send(body).expect(401);

        const refreshTokenCountAfter = await RefreshToken.count({ user: fixtures.user1 });
        expect(refreshTokenCountAfter).toEqual(refreshTokenCountBefore);

        const accessTokenCountAfter = await AccessToken.count({ user: fixtures.user1 });
        expect(accessTokenCountAfter).toEqual(accessTokenCountBefore);

        const credentials = testService.replaceValues(response.body, ["UUID", "DATE"]);
        expect(credentials).toMatchSnapshot("LoginMissingUsernameError");
    });

    it("/POST auth/login - should throw error for missing password", async () => {
        const body = {
            username: fixtures.user1.username
        };

        const refreshTokenCountBefore = await RefreshToken.count({ user: fixtures.user1 });
        expect(refreshTokenCountBefore).toEqual(1);

        const accessTokenCountBefore = await AccessToken.count({ user: fixtures.user1 });
        expect(accessTokenCountBefore).toEqual(1);

        const response = await request(app.getHttpServer()).post("/api/v1/auth/login").send(body).expect(401);

        const refreshTokenCountAfter = await RefreshToken.count({ user: fixtures.user1 });
        expect(refreshTokenCountAfter).toEqual(refreshTokenCountBefore);

        const accessTokenCountAfter = await AccessToken.count({ user: fixtures.user1 });
        expect(accessTokenCountAfter).toEqual(accessTokenCountBefore);

        const credentials = testService.replaceValues(response.body, ["UUID", "DATE"]);
        expect(credentials).toMatchSnapshot("LoginMissingPasswordError");
    });

    it("/POST auth/login - should return an error for a not existing username", async () => {
        const body = {
            username: "notExisting",
            password: "testPassword"
        };

        const refreshTokenCountBefore = await RefreshToken.count({ user: fixtures.user1 });
        expect(refreshTokenCountBefore).toEqual(1);

        const accessTokenCountBefore = await AccessToken.count({ user: fixtures.user1 });
        expect(accessTokenCountBefore).toEqual(1);

        const response = await request(app.getHttpServer()).post("/api/v1/auth/login").send(body).expect(401);

        const refreshTokenCountAfter = await RefreshToken.count({ user: fixtures.user1 });
        expect(refreshTokenCountAfter).toEqual(refreshTokenCountBefore);

        const accessTokenCountAfter = await AccessToken.count({ user: fixtures.user1 });
        expect(accessTokenCountAfter).toEqual(accessTokenCountBefore);

        const credentials = testService.replaceValues(response.body, ["UUID", "DATE"]);
        expect(credentials).toMatchSnapshot("LoginNotExistingUserError");
    });

    it("/POST auth/login - should return an error for a wrong password", async () => {
        const body = {
            username: fixtures.user1.username,
            password: "wrongPassword"
        };

        const refreshTokenCountBefore = await RefreshToken.count({ user: fixtures.user1 });
        expect(refreshTokenCountBefore).toEqual(1);

        const accessTokenCountBefore = await AccessToken.count({ user: fixtures.user1 });
        expect(accessTokenCountBefore).toEqual(1);

        const response = await request(app.getHttpServer()).post("/api/v1/auth/login").send(body).expect(401);

        const refreshTokenCountAfter = await RefreshToken.count({ user: fixtures.user1 });
        expect(refreshTokenCountAfter).toEqual(refreshTokenCountBefore);

        const accessTokenCountAfter = await AccessToken.count({ user: fixtures.user1 });
        expect(accessTokenCountAfter).toEqual(accessTokenCountBefore);

        const credentials = testService.replaceValues(response.body, ["UUID", "DATE"]);
        expect(credentials).toMatchSnapshot("LoginWrongPasswordError");
    });

    it("/POST auth/login - should return an error for a missing permission scope (user2)", async () => {
        const body = {
            username: fixtures.user2.username,
            password: "testPassword"
        };

        const refreshTokenCountBefore = await RefreshToken.count({ user: fixtures.user1 });
        expect(refreshTokenCountBefore).toEqual(1);

        const accessTokenCountBefore = await AccessToken.count({ user: fixtures.user1 });
        expect(accessTokenCountBefore).toEqual(1);

        const response = await request(app.getHttpServer()).post("/api/v1/auth/login").send(body).expect(403);

        const refreshTokenCountAfter = await RefreshToken.count({ user: fixtures.user1 });
        expect(refreshTokenCountAfter).toEqual(refreshTokenCountBefore);

        const accessTokenCountAfter = await AccessToken.count({ user: fixtures.user1 });
        expect(accessTokenCountAfter).toEqual(accessTokenCountBefore);

        const credentials = testService.replaceValues(response.body, ["UUID", "DATE"]);
        expect(credentials).toMatchSnapshot("MissingPermissionScopeUser2");
    });
});
