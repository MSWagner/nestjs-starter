import request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";

import { setupApp } from "../../../appSetup";

import { TestModule } from "../../../services/test/test.module";
import { TestService } from "../../../services/test/test.service";
import { AuthorizationTestController } from "./authorization-test.controller";
import { AuthModule } from "../../../services/auth/auth.module";

import * as fixtures from "../../../services/test/fixtures";

describe("AuthorizationTestController", () => {
    let app: INestApplication;
    let testService: TestService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthorizationTestController],
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

    it("### PermissionGuard - should return 401 for no access", async () => {
        const response = await request(app.getHttpServer())
            .get("/api/authorization-test/hello/user")
            .send()
            .expect(401);
        expect(response.body).toMatchSnapshot("NoPermissionsUser");
    });

    it("### PermissionGuard - should return 401 for no access", async () => {
        const response = await request(app.getHttpServer())
            .get("/api/authorization-test/hello/admin")
            .send()
            .expect(401);
        expect(response.body).toMatchSnapshot("NoPermissionsAdmin");
    });

    it("### PermissionGuard - should return 401 for no access", async () => {
        const response = await request(app.getHttpServer()).get("/api/authorization-test/hello/all").send().expect(401);
        expect(response.body).toMatchSnapshot("NoPermissionsAll");
    });

    it("### PermissionGuard - should return 403 with user without admin permission", async () => {
        const response = await request(app.getHttpServer())
            .get("/api/authorization-test/hello/admin")
            .auth(fixtures.accessToken1.token, { type: "bearer" })
            .send()
            .expect(403);
        expect(response.body).toMatchSnapshot("NoAdminPermission");
    });

    it("### PermissionGuard - should return 403 with user without user permission", async () => {
        const response = await request(app.getHttpServer())
            .get("/api/authorization-test/hello/user")
            .auth(fixtures.accessTokenUser3Admin.token, { type: "bearer" })
            .send()
            .expect(403);
        expect(response.body).toMatchSnapshot("NoUserPermission");
    });

    it('### PermissionGuard - should return "Hello World!" with admin permission', async () => {
        const response = await request(app.getHttpServer())
            .get("/api/authorization-test/hello/admin")
            .auth(fixtures.accessTokenUser3Admin.token, { type: "bearer" })
            .send()
            .expect(200);
        expect(response.text).toBe("Hello World!");
    });

    it('### PermissionGuard - should return "Hello World!" with user permission', async () => {
        const response = await request(app.getHttpServer())
            .get("/api/authorization-test/hello/user")
            .auth(fixtures.accessToken1.token, { type: "bearer" })
            .send()
            .expect(200);
        expect(response.text).toBe("Hello World!");
    });

    it('### PermissionGuard - should return "Hello World!" with user permission', async () => {
        const response = await request(app.getHttpServer())
            .get("/api/authorization-test/hello/all")
            .auth(fixtures.accessToken1.token, { type: "bearer" })
            .send()
            .expect(200);
        expect(response.text).toBe("Hello World!");
    });

    it('### PermissionGuard - should return "Hello World!" with admin permission', async () => {
        const response = await request(app.getHttpServer())
            .get("/api/authorization-test/hello/all")
            .auth(fixtures.accessTokenUser3Admin.token, { type: "bearer" })
            .send()
            .expect(200);
        expect(response.text).toBe("Hello World!");
    });
});
