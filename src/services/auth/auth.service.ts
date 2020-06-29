import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import * as _ from 'lodash';

import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { UserService } from '../user/user.service';

import { User } from '../../entities/User.entity';
import { AccessToken } from '../../entities/AccessToken.entity';
import { RefreshToken } from '../../entities/RefreshToken.entity';
import { PermissionScope } from '../../entities/Permission.entity';

import { CONFIG } from '../../configure';

@Injectable()
export class AuthService {

    constructor(
        @Inject(CONFIG.database.defaultAccessTokenRepoName)
        private readonly accessTokenRepository: Repository<AccessToken>,

        @Inject(CONFIG.database.defaultRefreshTokenRepoName)
        private readonly refreshTokenRepository: Repository<RefreshToken>,

        private readonly userService: UserService
    ) { }

    async generateToken(user: User): Promise<{ accessToken: AccessToken, refreshToken: RefreshToken }> {
        const newRefreshToken = new RefreshToken();
        newRefreshToken.validUntil = CONFIG.auth.refreshTokenValidityMS > 0
            ? moment().add(CONFIG.auth.refreshTokenValidityMS, 'milliseconds').toDate()
            : null;
        newRefreshToken.user = user;

        const accessToken = await this.generateAuthToken(user);
        const refreshToken = await this.refreshTokenRepository.save(newRefreshToken);

        return {
            accessToken,
            refreshToken
        };
    }

    async generateAuthToken(user: User): Promise<AccessToken> {
        const newAccessToken = new AccessToken();
        newAccessToken.validUntil = moment().add(CONFIG.auth.tokenValidity, 'milliseconds').toDate();
        newAccessToken.user = user;

        const accessToken = await this.accessTokenRepository.save(newAccessToken);

        return accessToken;
    }

    async validateUser(username: string, password: string, scopes: PermissionScope[]): Promise<User> {
        const user = await this.userService.findOne(username);

        if (_.isNil(user)) {
            return null;
        }

        if (!user.isActive) {
            return null;
        }

        // Check if the user has one of the necessary permission scopes
        if (!_.isEmpty(scopes)) {

            if (_.isNil(user.userPermissions)) { return null; }

            const userPermissionScopes = user.userPermissions.map((userPermission) => {
                return _.isNil(userPermission.permission) ? null : userPermission.permission.scope;
            });

            if (_.intersection(scopes, userPermissionScopes).length === 0) {
                return null;
            }
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        return isValid ? user : null;
    }

    async validateToken(token: string, scopes: PermissionScope[]): Promise<User> {
        const accessToken = await this.accessTokenRepository.findOne(token, { relations: ['user'] });

        if (_.isNil(accessToken)) {
            return null;
        }

        const isValid = moment().isSameOrBefore(accessToken.validUntil);

        if (!isValid) {
            await this.accessTokenRepository.delete(accessToken);
        }

        if (!accessToken.user.isActive) {
            return null;
        }

        // Check if the user has one of the necessary permission scopes
        if (!_.isEmpty(scopes)) {

            if (_.isNil(accessToken.user.userPermissions)) { return null; }

            const userPermissionScopes = accessToken.user.userPermissions.map((userPermission) => {
                return _.isNil(userPermission.permission) ? null : userPermission.permission.scope;
            });

            if (_.intersection(scopes, userPermissionScopes).length === 0) {
                return null;
            }
        }

        return isValid ? accessToken.user : null;
    }

    async register(username: string, password: string): Promise<User> {
        return this.userService.createUser(username, password);
    }

    async login(user: User) {
        return this.generateToken(user);
    }

    async refreshAuthToken(token: string) {
        const refreshToken = await this.refreshTokenRepository.findOne(token, { relations: ['user'] });

        const isValid = !_.isNil(refreshToken) && !_.isNil(refreshToken.user)
            && (_.isNil(refreshToken.validUntil) || moment().isSameOrBefore(refreshToken.validUntil));

        if (!isValid && !_.isNil(refreshToken)) {
            await this.refreshTokenRepository.delete(refreshToken);
        }

        return !isValid ? null : {
            accessToken: await this.generateAuthToken(refreshToken.user),
            refreshToken
        };
    }
}
