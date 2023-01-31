import * as bcrypt from "bcrypt";
import { Test, TestingModule } from "@nestjs/testing";

import { TestModule } from "../../services/test/test.module";
import { TestService } from "../../services/test/test.service";

import { UserService } from "./user.service";
import { userProviders } from "./user.providers";
import { UserPermission } from "../../entities/UserPermission.entity";

import * as fixtures from "../test/fixtures";

describe("UserService", () => {
    let service: UserService;
    let testService: TestService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [TestModule],
            providers: [...userProviders, UserService]
        }).compile();

        service = module.get<UserService>(UserService);
        testService = module.get<TestService>(TestService);

        await testService.reloadFixtures();
    });

    afterAll((done) => {
        testService.dataSource.destroy();
        done();
    });

    it("should find user1", async () => {
        const user1 = await service.findOne(fixtures.user1.username);

        expect(user1.uid).toEqual(fixtures.user1.uid);
    });

    it("should find user1 with user permissions", async () => {
        const user1UserPermission = await UserPermission.findOne({
            where: {
                userUid: fixtures.user1.uid
            }
        });
        expect(user1UserPermission).not.toBeNull();
        const user1 = await service.findOne(fixtures.user1.username);

        expect(user1.uid).toEqual(fixtures.user1.uid);
        expect(user1.userPermissions).not.toBeNull();
        expect(user1.userPermissions.length).toEqual(1);
        expect(user1.userPermissions[0].userUid).toEqual(user1UserPermission.userUid);
        expect(user1.userPermissions[0].permission.scope).toEqual(user1UserPermission.permission.scope);
    });

    it("should not find some user with unknown username", async () => {
        const user = await service.findOne("unknown");

        expect(user).toBeNull();
    });

    it("should create a new user", async () => {
        const username = "testUser";
        const pw = "testpw";

        const user = await service.createUser(username, pw);

        expect(user.username).toEqual(username);
        expect(user.passwordHash).not.toEqual(pw);

        const isValid = await bcrypt.compare(pw, user.passwordHash);
        expect(isValid).toBeTrue();
    });

    it("should return an error for a username conflict", async () => {
        const username = fixtures.user1.username;
        const pw = "testpw";

        try {
            const user = await service.createUser(username, pw);
            expect(user).toBeUndefined();
        } catch (err) {
            const errorMessage: string = err.message;

            expect(errorMessage).toInclude("duplicate key value violates unique constraint");
        }
    });
});
