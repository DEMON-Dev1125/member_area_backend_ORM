const pgtools = require('pgtools');
const dbConfig = {
    user: 'postgres',
    host: 'localhost',
    port: 5432,
    password: "1qasw2##"
};

const dbName = "memberareadb";

const makeDatabase = async() => {
    console.log('Trying to create a database');
    await pgtools.createdb(dbConfig, dbName);
    console.log('Database created successfully');
}

module.exports = makeDatabase;