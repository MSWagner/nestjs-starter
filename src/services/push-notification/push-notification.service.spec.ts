import { Test, TestingModule } from "@nestjs/testing";

import { TestModule } from "../test/test.module";
import { TestService } from "../test/test.service";
import { User } from "../../entities/User.entity";

import { pushTokenProviders } from "./providers/push-token.provider";
import { PushNotificationService } from "./push-notification.service";
import { PushToken } from "../../entities/PushToken.entity";

import * as fixtures from "../../services/test/fixtures";

describe("PushNotificationService", () => {
    let service: PushNotificationService;
    let testService: TestService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PushNotificationService, ...pushTokenProviders],
            imports: [TestModule]
        }).compile();

        service = module.get<PushNotificationService>(PushNotificationService);
        testService = module.get<TestService>(TestService);

        await testService.reloadFixtures();
    });

    afterAll((done) => {
        testService.connectionManager.connection.close();
        done();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should return new generated token for user1", async () => {
        const user1TokenCount = await PushToken.count({ where: { user: fixtures.user1.uid } });
        expect(user1TokenCount).toBe(1);

        const userToken = await PushToken.findOne({ where: { user: fixtures.user1.uid } });
        expect(userToken.token).toBe(fixtures.user1PushToken.token);

        const user = await User.findOne({ where: { uid: fixtures.user1.uid } });
        const token = await service.upsertPushToken("testTokenUser1", user);

        expect(user).not.toBe(null);
        expect(token).not.toBe(null);
        expect(token.token).toBe("testTokenUser1");

        const user1TokenCountAfter = await PushToken.count({ where: { user: fixtures.user1.uid } });

        expect(user1TokenCountAfter).toBe(1);
    });

    it("should return new generated token for user2", async () => {
        const userTokenCount = await PushToken.count({ where: { user: fixtures.user2.uid } });
        expect(userTokenCount).toBe(0);

        const user = await User.findOne({ where: { uid: fixtures.user2.uid } });
        const token = await service.upsertPushToken("testTokenUser2", user);

        expect(user).not.toBe(null);
        expect(token).not.toBe(null);
        expect(token.token).toBe("testTokenUser2");

        const userTokenCountAfter = await PushToken.count({ where: { user: fixtures.user2.uid } });

        expect(userTokenCountAfter).toBe(1);
    });

    it("should return null because of pushToken conflict", async () => {
        const user1TokenCount = await PushToken.count({ where: { user: fixtures.user1.uid } });

        expect(user1TokenCount).toBe(1);

        const user = await User.findOne({ where: { uid: fixtures.user1.uid } });
        const token = await service.upsertPushToken(fixtures.user3PushToken.token, user);

        expect(user).not.toBe(null);
        expect(token).toBe(null);

        const user1TokenCountAfter = await PushToken.count({ where: { user: fixtures.user1.uid } });

        expect(user1TokenCountAfter).toBe(1);
    });
});
