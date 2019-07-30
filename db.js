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

//BRING IN ALL MODELS TO THE DB OBJECT
db.User = require('./Models/user-model.js')(sequelize, Sequelize);
db.Post = require('./Models/post-model.js')(sequelize, Sequelize);
db.Comment = require('./Models/comment-model.js')(sequelize, Sequelize);
db.Like = require('./Models/like-model.js')(sequelize, Sequelize);
db.Following = require('./Models/following-model.js')(sequelize, Sequelize);

//ASSOCIATE USERS
db.User.hasMany(db.Post);
db.User.hasMany(db.Comment);
db.User.hasMany(db.Like);
db.User.hasMany(db.Following);
db.Like.belongsTo(db.User);
db.Comment.belongsTo(db.User);
db.Following.belongsTo(db.User);
db.Post.belongsTo(db.User);

//ASSOCIATE POST
db.Post.hasMany(db.Comment);
db.Post.hasMany(db.Like);
db.Comment.belongsTo(db.Post);
db.Like.belongsTo(db.Post);

module.exports = db;