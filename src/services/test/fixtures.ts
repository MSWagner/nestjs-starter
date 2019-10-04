export const permissionUser = {
    uid: 'd7316b3e-44de-42b8-bc9b-bbf190cd98fa',
    scope: 'user'
};

export const permissionAdmin = {
    uid: 'ebf943cd-cd67-4720-bd40-6cf3c25e4054',
    scope: 'admin'
};

export const user1 = {
    uid: '0961866f-ff60-4219-973c-109eecfa52bd',
    username: 'user1',
    passwordHash: '$2b$10$n8McQmLm6U/RXlRb9HxNEOgurQecAokxI2oCoumlSOlOj4M.aU59K', // testPassword
};

export const user2 = {
    uid: '515c96fd-7535-4e74-92ff-2bfbe960c6e6',
    username: 'user2',
    passwordHash: '$2b$10$n8McQmLm6U/RXlRb9HxNEOgurQecAokxI2oCoumlSOlOj4M.aU59K', // testPassword
};

export const user1Permission = {
    user: user1.uid,
    permission: permissionUser.uid
};

export const accessToken1 = {
    token: '4f593a80-0ecb-49c3-9685-4d59be8239aa',
    validUntil: '2050-08-07 23:45:22.501',
    user: user1.uid,
};

export const invalidAccessToken = {
    token: 'b0d5c63f-b69b-4f5f-b737-627aadf38615',
    validUntil: '2010-08-07 23:45:22.501',
    user: user2.uid,
};

export const refreshToken1 = {
    token: '5306fa4e-880b-4a9f-8e5e-7d62775342b6',
    user: user1.uid,
};

export const invalidRefreshToken = {
    token: '8781b807-6036-4af2-8db4-1f3f7b33f9e3',
    validUntil: '2010-08-07 23:45:22.501',
    user: user2.uid,
};

export const fixtureTrees = {
    Permission: [
        permissionAdmin,
        permissionUser
    ],
    User: [
        user1,
        user2
    ],
    UserPermission: [
        user1Permission,
    ],
    RefreshToken: [
        refreshToken1,
        invalidRefreshToken
    ],
    AccessToken: [
        accessToken1,
        invalidAccessToken
    ],
};
