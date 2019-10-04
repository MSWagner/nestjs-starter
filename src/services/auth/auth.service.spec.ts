import { Test, TestingModule } from '@nestjs/testing';

import { TestModule } from '../../services/test/test.module';
import { TestService } from '../../services/test/test.service';

import { AuthService } from './auth.service';
import { accessTokenProviders } from './providers/accessTokenProviders';
import { refreshTokenProviders } from './providers/refreshTokenProviders';

import { userProviders } from '../user/user.providers';
import { UserService } from '../user/user.service';

import { User } from '../../entities/User.entity';
import { AccessToken } from '../../entities/AccessToken.entity';
import { RefreshToken } from '../../entities/RefreshToken.entity';

import { user1, accessToken1, invalidAccessToken, refreshToken1, invalidRefreshToken, fixtureTrees } from '../../services/test/fixtures';

describe('AuthService', () => {
    let service: AuthService;
    let testService: TestService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                ...accessTokenProviders,
                ...refreshTokenProviders,
                UserService,
                ...userProviders
            ],
            imports: [TestModule]
        }).compile();

        service = module.get<AuthService>(AuthService);
        testService = module.get<TestService>(TestService);

        await testService.reloadFixtures();
    });

    it('should return new generated token for user1', async () => {
        const user1AccessTokenCount = await AccessToken.count({ where: { user: user1.uid } });
        const user1RefreshTokenCount = await RefreshToken.count({ where: { user: user1.uid } });

        expect(user1AccessTokenCount).toBe(1);
        expect(user1RefreshTokenCount).toBe(1);

        const user = await User.findOne({ where: { uid: user1.uid } });
        const tokens = await service.generateToken(user);

        expect(tokens.accessToken).not.toBe(null);
        expect(tokens.refreshToken).not.toBe(null);

        const user1AccessTokenCountAfter = await AccessToken.count({ where: { user: user1.uid } });
        const user1RefreshTokenCountAfter = await RefreshToken.count({ where: { user: user1.uid } });

        expect(user1AccessTokenCountAfter).toBe(2);
        expect(user1RefreshTokenCountAfter).toBe(2);
    });

    it('should return validated user1 with user', async () => {
        const user = await service.validateUser(user1.username, 'testPassword', ['user']);

        expect(user).not.toBe(null);

        const userWithoutDates = testService.replaceDates(user);
        expect(userWithoutDates).toMatchSnapshot('ValidatedUser1WithUser');
    });

    it('should return null for wrong user permission scope (user1)', async () => {
        const user = await service.validateUser(user1.username, 'testPassword', ['admin']);

        expect(user).toBe(null);

        const userWithoutDates = testService.replaceDates(user);
        expect(userWithoutDates).toMatchSnapshot('UserPermissionScopeError');
    });

    it('should return null for wrong user1 password', async () => {
        const user = await service.validateUser(user1.username, 'wrongPassword', ['user']);

        expect(user).toBe(null);
    });

    it('should return null for wrong username', async () => {
        const user = await service.validateUser('wrongUsername', 'testPassword', ['user']);

        expect(user).toBe(null);
    });

    it('should return validated user1 with token', async () => {
        const user = await service.validateToken(accessToken1.token);

        expect(user).not.toBe(null);

        const userWithoutDates = testService.replaceDates(user);
        expect(userWithoutDates).toMatchSnapshot('ValidatedUser1WithToken');
    });

    it('should return null for invalid token and delete it', async () => {
        const accessTokenCountBefore = await AccessToken.count({ token: invalidAccessToken.token });
        expect(accessTokenCountBefore).toEqual(1);

        const user = await service.validateToken(invalidAccessToken.token);

        expect(user).toBe(null);

        const accessTokenCountAfter = await AccessToken.count({ token: invalidAccessToken.token });
        expect(accessTokenCountAfter).toEqual(0);
    });

    it('should register new user', async () => {
        const userCountBefore = await User.count();
        expect(userCountBefore).toBe(fixtureTrees.User.length);

        const user = await service.register('newUsername', 'password');

        expect(user).not.toBe(null);
        expect(user.username).toBe('newUsername');

        const userCountAfter = await User.count();
        expect(userCountAfter).toBe(fixtureTrees.User.length + 1);
    });

    it('should throw error for username confict', async () => {
        const userCountBefore = await User.count();
        expect(userCountBefore).toBe(fixtureTrees.User.length);

        try {
            const user = await service.register(user1.username, 'password');
            expect(user).toBe(null);

        } catch (err) {
            const errorMessage: string = err.message;

            expect(errorMessage).toInclude('duplicate key value violates unique constraint');
        }
    });

    it('should return new generated token for user1 login', async () => {
        const user1AccessTokenCount = await AccessToken.count({ where: { user: user1.uid } });
        const user1RefreshTokenCount = await RefreshToken.count({ where: { user: user1.uid } });

        expect(user1AccessTokenCount).toBe(1);
        expect(user1RefreshTokenCount).toBe(1);

        const user = await User.findOne({ where: { uid: user1.uid } });
        const tokens = await service.login(user);

        expect(tokens.accessToken).not.toBe(null);
        expect(tokens.refreshToken).not.toBe(null);

        // To test the option with 0 as refreshTokenValidityMS
        expect(tokens.refreshToken.validUntil).toBe(null);

        const user1AccessTokenCountAfter = await AccessToken.count({ where: { user: user1.uid } });
        const user1RefreshTokenCountAfter = await RefreshToken.count({ where: { user: user1.uid } });

        expect(user1AccessTokenCountAfter).toBe(2);
        expect(user1RefreshTokenCountAfter).toBe(2);
    });

    it('should return new generated token with refreshToken', async () => {
        const user1AccessTokenCount = await AccessToken.count({ where: { user: user1.uid } });
        const user1RefreshTokenCount = await RefreshToken.count({ where: { user: user1.uid } });

        expect(user1AccessTokenCount).toBe(1);
        expect(user1RefreshTokenCount).toBe(1);

        const tokens = await service.refreshAuthToken(refreshToken1.token);

        expect(tokens.accessToken).not.toBe(null);
        expect(tokens.refreshToken).not.toBe(null);

        const user1AccessTokenCountAfter = await AccessToken.count({ where: { user: user1.uid } });
        const user1RefreshTokenCountAfter = await RefreshToken.count({ where: { user: user1.uid } });

        expect(user1AccessTokenCountAfter).toBe(2);
        expect(user1RefreshTokenCountAfter).toBe(1);
    });

    it('should return null for not existing refreshToken', async () => {
        const user1AccessTokenCount = await AccessToken.count({ where: { user: user1.uid } });
        const user1RefreshTokenCount = await RefreshToken.count({ where: { user: user1.uid } });

        expect(user1AccessTokenCount).toBe(1);
        expect(user1RefreshTokenCount).toBe(1);

        const tokens = await service.refreshAuthToken('b393dafd-0492-417d-939f-1675c84b8e2d');

        expect(tokens).toBe(null);
    });

    it('should return null for invalid refreshToken', async () => {
        const refreshTokenCountBefore = await RefreshToken.count({ token: invalidRefreshToken.token });
        expect(refreshTokenCountBefore).toBe(1);

        const tokens = await service.refreshAuthToken(invalidRefreshToken.token);

        expect(tokens).toBe(null);

        const refreshTokenCountAfter = await RefreshToken.count({ token: invalidRefreshToken.token });
        expect(refreshTokenCountAfter).toBe(0);
    });
});
