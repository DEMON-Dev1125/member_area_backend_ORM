const express = require('express');
const db = require('./db');
const cors = require("cors");
const path = require('path');
// const httpRouter = require('./routes/index.js');
const users = require('./routes/user')
const settings = require('./routes/settings')
const appearance = require('./routes/Appearance')
const certificates = require('./routes/certificate')
const invites = require('./routes/invite')
const modules = require('./routes/module')
const contents = require('./routes/content')
const courses = require('./routes/course')
const members = require('./routes/member')
const groups = require('./routes/group')

const app = express();

const makeDatabase = require('./functions/makeDatabase');
const seedDatabase = require('./functions/seedDatabase');

const PORT = 5000;
app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use('/public',express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
     if (req.method === 'OPTIONS') {
         res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
         return res.status(200).json({});
     }
     next();
});
const syncDB = async () => {
    try {
        await db.sync({ force: false });
    } catch (error) {
        if (error.name == 'SequelizeConnectionError') {
            await makeDatabase();
            await db.sync({ forse: true });
            await seedDatabase();
        }
        else {
            console.log(error);
        }
    }
}

const utilities = async () => {
    app.use('/api/users', users);
    app.use('/api/courses', courses);
    app.use('/api/contents', contents);
    app.use('/api/modules', modules);
    app.use('/api/groups', groups);
    app.use('/api/certificates', certificates);
    app.use('/api/invites', invites);
    app.use('/api/members', members);
    app.use('/api/settings', settings);
    app.use('/api/appearances', appearance);
    app.listen(PORT, () => {
        console.log(`Running on port ${PORT}`);
    })
}

const start = async () => {
    await syncDB();
    await utilities();
}

start();