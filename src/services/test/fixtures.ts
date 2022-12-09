export const permissionUser = {
    uid: "d7316b3e-44de-42b8-bc9b-bbf190cd98fa",
    scope: "user"
};

export const permissionAdmin = {
    uid: "ebf943cd-cd67-4720-bd40-6cf3c25e4054",
    scope: "admin"
};

export const user1 = {
    uid: "0961866f-ff60-4219-973c-109eecfa52bd",
    username: "user1@email.at",
    isActive: true,
    passwordHash: "$2b$10$n8McQmLm6U/RXlRb9HxNEOgurQecAokxI2oCoumlSOlOj4M.aU59K" // testPassword
};

export const user2 = {
    uid: "515c96fd-7535-4e74-92ff-2bfbe960c6e6",
    username: "user2@email.at",
    isActive: true,
    passwordHash: "$2b$10$n8McQmLm6U/RXlRb9HxNEOgurQecAokxI2oCoumlSOlOj4M.aU59K" // testPassword
};

export const user3 = {
    uid: "435c0a53-9e6b-488a-9d1c-582b108ed3e7",
    isActive: true,
    username: "user3@email.com"
};

export const userInActive = {
    uid: "17f0263a-87b1-4760-90c1-2e596a514678",
    username: "userInActive@email.com",
    passwordHash: "$2b$10$n8McQmLm6U/RXlRb9HxNEOgurQecAokxI2oCoumlSOlOj4M.aU59K" // testPassword
};

export const user1Permission = {
    user: user1.uid,
    permission: permissionUser.uid
};

export const user3Permission = {
    user: user3.uid,
    permission: permissionAdmin.uid
};

export const accessToken1 = {
    token: "4f593a80-0ecb-49c3-9685-4d59be8239aa",
    validUntil: "2050-08-07 23:45:22.501",
    user: user1.uid
};

export const accessTokenUser2 = {
    token: "190c51c5-5930-42e8-86cf-3794977f1e9b",
    validUntil: "2050-08-07 23:45:22.501",
    user: user2.uid
};

export const accessTokenUser3Admin = {
    token: "0fa3f2c4-04e4-4d9e-b983-b2475b799d18",
    validUntil: "2050-08-07 23:45:22.501",
    user: user3.uid
};

export const invalidAccessToken = {
    token: "b0d5c63f-b69b-4f5f-b737-627aadf38615",
    validUntil: "2010-08-07 23:45:22.501",
    user: user2.uid
};

export const refreshToken1 = {
    token: "5306fa4e-880b-4a9f-8e5e-7d62775342b6",
    user: user1.uid
};

export const invalidRefreshToken = {
    token: "8781b807-6036-4af2-8db4-1f3f7b33f9e3",
    validUntil: "2010-08-07 23:45:22.501",
    user: user2.uid
};

export const user1PushToken = {
    uid: "733d80fd-d861-4638-99c8-fcc5c5e93963",
    token: "user1PushTokenFixtures",
    user: user1.uid
};

export const user3PushToken = {
    uid: "ff5fce38-ca56-4e08-be2c-7af095266bf6",
    token: "user3PushTokenFixtures",
    user: user3.uid
};

export const fixtureTrees = {
    Permission: [permissionAdmin, permissionUser],
    User: [user1, user2, user3, userInActive],
    UserPermission: [user1Permission, user3Permission],
    RefreshToken: [refreshToken1, invalidRefreshToken],
    AccessToken: [accessToken1, accessTokenUser2, accessTokenUser3Admin, invalidAccessToken],
    PushToken: [user1PushToken, user3PushToken]
};
