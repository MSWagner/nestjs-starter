import { Test, TestingModule } from "@nestjs/testing";
import { TestService } from "./test.service";
import { DatabaseModule } from "../database/database.module";

import { User } from "../../entities/User.entity";
import { AccessToken } from "../../entities/AccessToken.entity";
import { RefreshToken } from "../../entities/RefreshToken.entity";

import { fixtureTrees } from "./fixtures";

describe("TestService", () => {
    let service: TestService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [TestService, DatabaseModule]
        }).compile();

        service = module.get<TestService>(TestService);
    });

    afterAll((done) => {
        service.connectionManager.connection.close();
        done();
    });

    it("should check the orderIds of the User, AccessToken & RefreshToken entities", () => {
        const userOrder = service.getOrder("User");
        const refreshTokenOrder = service.getOrder("RefreshToken");
        const accessTokenOrder = service.getOrder("AccessToken");

        expect(userOrder).toEqual(1);
        expect(refreshTokenOrder).toEqual(3);
        expect(accessTokenOrder).toEqual(4);
    });

    it("should return all entities", async () => {
        const entities = await service.getEntities();

        expect(entities).toMatchSnapshot("DatabaseEntitiyList");
    });

    it("should reload the fixtures without a additional user from before", async () => {
        const newUser = new User();
        newUser.username = "TestUser";
        await newUser.save();

        const newUserCountBefore = await User.count({ username: "TestUser" });
        expect(newUserCountBefore).toEqual(1);

        await service.reloadFixtures();

        const newUserCountAfter = await User.count({ username: "TestUser" });
        expect(newUserCountAfter).toEqual(0);
    });

    it("should remove all fixtures & load them again into the db", async () => {
        const userCountBefore = await User.count();
        expect(userCountBefore).toEqual(fixtureTrees.User.length);

        const refreshTokenCountBefore = await RefreshToken.count();
        expect(refreshTokenCountBefore).toEqual(fixtureTrees.RefreshToken.length);

        const accessTokenCountBefore = await AccessToken.count();
        expect(accessTokenCountBefore).toEqual(fixtureTrees.AccessToken.length);

        const entities = await service.getEntities();
        await service.cleanAll(entities);

        const userCountAfterClean = await User.count();
        expect(userCountAfterClean).toEqual(0);

        const refreshTokenCountAfterClean = await RefreshToken.count();
        expect(refreshTokenCountAfterClean).toEqual(0);

        const accessTokenCountAfterClean = await AccessToken.count();
        expect(accessTokenCountAfterClean).toEqual(0);

        await service.loadAll(entities);

        const userCountAfterLoad = await User.count();
        expect(userCountAfterLoad).toEqual(fixtureTrees.User.length);

        const refreshTokenCountAfterLoad = await RefreshToken.count();
        expect(refreshTokenCountAfterLoad).toEqual(fixtureTrees.RefreshToken.length);

        const accessTokenCountAfterLoad = await AccessToken.count();
        expect(accessTokenCountAfterLoad).toEqual(fixtureTrees.AccessToken.length);
    });

    it("should replace all uuids in the object", async () => {
        const object = [
            {
                test: {
                    i1: "d3fd0451-ec15-4f60-8e64-9142c4ab3a89"
                },
                test2: [[{ test3: "020bf68b-23bd-42b6-92b9-c6e0e897eb8f" }, "757d21f0-f72c-4dc4-a6d4-badd1305ea7a"]]
            },
            "44218412-bfe7-4c70-aeca-276c0fcf099e",
            {
                test: {
                    i1: "2019-09-28 15:26:33.186"
                },
                test2: [[{ test3: "2019-09-28 15:26:33.186" }, "2019-09-28 15:26:33.186"]]
            },
            "2019-09-28 15:26:33.186"
        ];

        const replacedObject = service.replaceUUIDs(object);

        expect(replacedObject).toMatchSnapshot("UUIDsReplaced");
    });

    it("should replace all dates in the object", async () => {
        const object = [
            {
                test: {
                    i1: "d3fd0451-ec15-4f60-8e64-9142c4ab3a89"
                },
                test2: [[{ test3: "020bf68b-23bd-42b6-92b9-c6e0e897eb8f" }, "757d21f0-f72c-4dc4-a6d4-badd1305ea7a"]]
            },
            "44218412-bfe7-4c70-aeca-276c0fcf099e",
            {
                test: {
                    i1: "2019-09-28 15:26:33.186"
                },
                test2: [[{ test3: "2019-09-28 15:26:33.186" }, "2019-09-28 15:26:33.186"]]
            },
            "2019-09-28 15:26:33.186"
        ];

        const replacedObject = service.replaceDates(object);

        expect(replacedObject).toMatchSnapshot("DateReplaced");
    });

    it("should replace all dates & uuids in the object", async () => {
        const object = [
            {
                test: {
                    i1: "d3fd0451-ec15-4f60-8e64-9142c4ab3a89"
                },
                test2: [[{ test3: "020bf68b-23bd-42b6-92b9-c6e0e897eb8f" }, "757d21f0-f72c-4dc4-a6d4-badd1305ea7a"]]
            },
            "44218412-bfe7-4c70-aeca-276c0fcf099e",
            {
                test: {
                    i1: "2019-09-28 15:26:33.186"
                },
                test2: [[{ test3: "2019-09-28 15:26:33.186" }, "2019-09-28 15:26:33.186"]]
            },
            "2019-09-28 15:26:33.186"
        ];

        const replacedObject = service.replaceValues(object, ["DATE", "UUID"]);

        expect(replacedObject).toMatchSnapshot("ReplaceDateAndUUIDs");
    });
});
