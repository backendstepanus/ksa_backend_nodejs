require('dotenv').config();

module.exports = {
    // development: {
    //     client: 'pg',
    //     connection: "postgres://postgres:123456@127.0.0.1:5432/KSA",
    //     migrations: {
    //         directory: './db/migrations'
    //     },
    //     useNullAsDefault: true
    // },

    production: {
        client: 'postgresql',
        connection: process.env.DB_URL,
        migrations: {
            directory: './db/migrations'
        },
        useNullAsDefault: true
    }
};