module.exports = {
    port: process.env.PORT || 8080,
    db: process.env.MONGODB || 'mongodb://localhost:27017/folios',
    TOKEN_SECRET: process.env.TOKEN_SECRET || "tokenultrasecreto",
}