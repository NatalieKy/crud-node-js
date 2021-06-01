require('dotenv').config();
const file_uploader = require('express-fileupload');
const express = require('express');
const path = require('path');

const database = require('./source/dataBase_SQL');
const { auth_routes, user_routes } = require('./source/routes');
const { delete_tokens_after_one_week } = require('./source/cron_jobs');

const app = express();

database.getInstance().setModels();

app.use(file_uploader());
app.use(express.static(path.join(process.cwd(), 'source', 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/auth', auth_routes);
app.use('/user', user_routes);
// eslint-disable-next-line no-unused-vars
app.use('*', (err, req, res, next) => {
    res
        .status(err.code || 500)
        .json({
            message: err.message
        });
});

app.listen(5000, async () => {
    // eslint-disable-next-line no-console
    console.log('The server is running');

    await delete_tokens_after_one_week();
});
