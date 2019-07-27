require('dotenv').config();
const express = require('express'),
    app = express(),
    User = require('./Controllers/user'),
    Post = require('./Controllers/post'),
    db = require('./db');
db.sequelize.sync();
app.use(require('./Middleware/headers'));
app.use(require('express').json());
app.use('/user', User);
app.use('/post', Post);
app.listen(process.env.PORT, () => console.log(`Port is listening on ${process.env.PORT}`));