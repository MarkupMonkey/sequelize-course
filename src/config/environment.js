export default {
    port: parseInt(process.env.PORT) || 8080,
    nodeEnv: process.env.NODE.ENV || 'production',
    saltRounds: parseInt(process.env.SALT_ROUNDS) || 10,
    jwtAccessTokenSecret:
        process.env.JWT_ACCESS_TOKEN_SECRET ||
        '08054dd842392d36d3364ce1a9851560792ebfe00f58573868602b5b85f297e4',
    jwtRefreshTokenSecret:
        process.env.JWT_REFRESH_TOKEN_SECRET ||
        '37786bfe4c851594d6bf194b50c2462019aca077a7567b0a1be5fd958903a951',

};