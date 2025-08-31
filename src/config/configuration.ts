export default () => ({
    nodeEnv : process.env.NODE_ENV || 'development',
    port : process.env.PORT,
    database : {
        host : process.env.DATABASE_HOST,
        port : process.env.DATABASE_PORT || 3306,
        username : process.env.DATABASE_USER_NAME,
        password : process.env.DATABASE_PASSWORD,
        databaseName : process.env.DATABASE_NAME
    },
    jwt : {
        secretKey : process.env.SERCRET_KEY,
        expirationTime : process.env.EXPIRATION_TIME
    },
    mail : {
        smtp_user : process.env.SMTP_USER,
        smtp_pass : process.env.SMTP_PASS
    }
})