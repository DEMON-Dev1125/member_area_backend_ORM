
const User = require('./user');
const Setting = require('./setting');
const Appearance = require('./appearance');
const Certificate = require('./certificate');
const Invite = require('./invite');
const Module = require('./module');
const Content = require('./content');
const Course = require('./course');
const Group = require('./group');
const Classmodule = require('./classmodule');

// Module.hasMany(Content, {
//     foreignKey: "moduleId",
//     otherKey: "contentId"
// });
// Content.belongsTo(Module, {
//     foreignKey: "moduleId",
//     otherKey: "moduleId"
// })

module.exports = {
    User, 
    Setting, 
    Appearance, 
    Certificate, 
    Invite,
    Module,
    Content,
    Course,
    Group,
    Classmodule,
}