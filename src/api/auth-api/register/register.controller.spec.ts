import request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";

import { setupApp } from "../../../appSetup";

import { TestModule } from "../../../services/test/test.module";
import { TestService } from "../../../services/test/test.service";
import { RegisterController } from "./register.controller";
import { AuthModule } from "../../../services/auth/auth.module";

import { User } from "../../../entities/User.entity";

import * as fixtures from "../../../services/test/fixtures";

describe("Register Controller", () => {
    let app: INestApplication;
    let testService: TestService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RegisterController],
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

    it("/POST auth/register - should register an new user", async () => {
        const registerBody = {
            username: "test1",
            password: "passwordTest"
        };

        const userCountBefore = await User.count({ username: registerBody.username });
        expect(userCountBefore).toEqual(0);

        const response = await request(app.getHttpServer())
            .post("/api/v1/auth/register")
            .send(registerBody)
            .expect(201);

        const userCountAfter = await User.count({ username: registerBody.username });
        expect(userCountAfter).toEqual(1);

        const credentials = testService.replaceValues(response.body, ["UUID", "DATE"]);
        expect(credentials).toMatchSnapshot("RegisterCredentials");
    });

    it("/POST auth/register - should throw an error for a username conflict", async () => {
        const registerBody = {
            username: fixtures.user1.username,
            password: "passwordTest"
        };

        const response = await request(app.getHttpServer())
            .post("/api/v1/auth/register")
            .send(registerBody)
            .expect(409);

        const credentials = testService.replaceValues(response.body, ["UUID", "DATE"]);
        expect(credentials).toMatchSnapshot("RegisterUsernameConflictError");
    });

    it("/POST auth/register - should throw an error for missing username", async () => {
        const registerBody = {
            password: "passwordTest"
        };

        const response = await request(app.getHttpServer())
            .post("/api/v1/auth/register")
            .send(registerBody)
            .expect(400);

        const credentials = testService.replaceValues(response.body, ["UUID", "DATE"]);
        expect(credentials).toMatchSnapshot("RegisterUsernameMissingError");
    });

    it("/POST auth/register - should throw an error for missing password", async () => {
        const registerBody = {
            username: "test1"
        };

        const response = await request(app.getHttpServer())
            .post("/api/v1/auth/register")
            .send(registerBody)
            .expect(400);

        const credentials = testService.replaceValues(response.body, ["UUID", "DATE"]);
        expect(credentials).toMatchSnapshot("RegisterPasswordMissingError");
    });

    it("/POST auth/register - should throw an error for a to short password", async () => {
        const registerBody = {
            username: "test1",
            password: "passw"
        };

        const response = await request(app.getHttpServer())
            .post("/api/v1/auth/register")
            .send(registerBody)
            .expect(400);

        const credentials = testService.replaceValues(response.body, ["UUID", "DATE"]);
        expect(credentials).toMatchSnapshot("RegisterPasswordToShortError");
    });

    it("/POST auth/register - should throw an error for a to short username", async () => {
        const registerBody = {
            username: "te",
            password: "password"
        };

        const response = await request(app.getHttpServer())
            .post("/api/v1/auth/register")
            .send(registerBody)
            .expect(400);

        const credentials = testService.replaceValues(response.body, ["UUID", "DATE"]);
        expect(credentials).toMatchSnapshot("RegisterUsernameToShortError");
    });
});
