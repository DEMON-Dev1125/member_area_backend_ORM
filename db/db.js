const Sequelize = require('sequelize');

//const db = new Sequelize(process.env.DB_URL || `postgres://localhost:5432/${dbName}`, {logging: false});
const db = new Sequelize(
    "memberareadb", //DB name
    "postgres",     //postgre user name
    "1qasw2##",     //postgre user password
    {
        "host": 'localhost',  //host
        "dialect": "postgres",
        "port": 5432,         //port
    define: {
        timestamps: false
    },
    logging: false
})

module.exports = db;