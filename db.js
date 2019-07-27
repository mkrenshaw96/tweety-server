const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.NAME, 'postgres', process.env.PASS, {
    host: 'localhost',
    dialect: 'postgres'
});

sequelize.authenticate()
    .then(() => console.log('  * * * POSTGRES DATABASE IS NOW CONNECTED * * *  '))
    .catch(err => console.log(err))

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./Models/user-model.js')(sequelize, Sequelize);

module.exports = db;