export const CONFIG = {
    env: {
        isProduction: process.env.NODE_ENV === "production",
        isTest: process.env.NODE_ENV === "test",
        isDevelopment: process.env.NODE_ENV === "development"
    },

    auth: {
        tokenValidity: parseInt(process.env.TOKEN_VALIDITY, 10) || 86400000,
        refreshTokenValidityMS: parseInt(process.env.REFRESH_TOKEN_VALIDITY, 10) || 0 // default 0 = unlimited
    },

    database: {
        defaultConnectionName: "DATABASE_CONNECTION",
        defaultUserRepoName: "USER_REPOSITORY",
        defaultAccessTokenRepoName: "ACCESS_TOKEN_REPOSITORY",
        defaultRefreshTokenRepoName: "REFRESH_TOKEN_REPOSITORY",
        defaultPushTokenRepoName: "PUSH_TOKEN_REPOSITORY"
    }
};

export default CONFIG;
