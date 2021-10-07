import * as bcrypt from "bcrypt";
import { Test, TestingModule } from "@nestjs/testing";

import { TestModule } from "../../services/test/test.module";
import { TestService } from "../../services/test/test.service";

import { UserService } from "./user.service";
import { userProviders } from "./user.providers";

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
        testService.connectionManager.connection.close();
        done();
    });

    it("should find user1", async () => {
        const user1 = await service.findOne(fixtures.user1.username);

        expect(user1.uid).toEqual(fixtures.user1.uid);
    });

    it("should not find some user with unknown username", async () => {
        const user = await service.findOne("unknown");

        expect(user).toBeUndefined();
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
