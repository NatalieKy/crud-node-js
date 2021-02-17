const fs = require('fs-extra').promises;
const path = require('path');
const uuid = require('uuid').v1();
const jwt = require('jsonwebtoken');

const { password_hasher } = require('../../utilities/password_bcrypt');
const { transactionInstance } = require('../../dataBase_SQL').getInstance();
const {
    email_events: { ACCOUNT_VERIFICATION },
    http_status_codes: { CREATED, OK, NO_CONTENT },
    constants: { HOST, PATH_NAME_FOR_VERIFICATION_EMAIL, VERIFY_EMAIL_TOKEN_LIFE, VERIFY_YOUR_ACCOUNT_TEXT },
    config: { VERIFY_EMAIL_TOKEN_WORD }
} = require('../../configs');
const {
    email_sender_services: { email_sender },
    user_services: { create_user_service, update_user_service, update_user_avatar_service, delete_user_service,
        update_verify_token_service, update_token_for_password_reset_service }
} = require('../../services');

module.exports = {

    get_user_controller: (req, res, next) => {
        try {
            const { user } = req;
            const user_for_frontend = {};
            const { user_id, name, surname, age, gender, email } = user;

            Object.assign(user_for_frontend, { user_id, name, surname, age, gender, email });

            res.status(OK).json(user_for_frontend);
        } catch (e) {
            next(e);
        }
    },

    reate_user_controller: async (req, res, next) => {
        const transaction = await transactionInstance();

        try {
            const { avatar } = req;
            const user_password = await password_hasher(req.body.password);
            const active = false;
            const new_user = await create_user_service({ ...req.body }, user_password, active, transaction);
            const { user_id } = new_user.dataValues;

            if (avatar) {
                const avatar_extension = avatar.name.split('.').pop();
                const new_avatar_name = `${uuid}.${avatar_extension}`;
                const avatar_path_without_public = path.join('users', `${user_id}`, 'avatar');
                const avatar_full_path = path.join(process.cwd(), 'source', 'public', avatar_path_without_public);
                const avatar_path = path.join(avatar_path_without_public, new_avatar_name);

                await fs.mkdir(path.join(avatar_full_path), { recursive: true });
                await avatar.mv(path.join(avatar_full_path, new_avatar_name));

                await update_user_avatar_service(avatar_path, user_id, transaction);
            }

            delete new_user.dataValues.password;

            const id = { id: user_id };
            const token_for_verification = jwt.sign(
                { id }, VERIFY_EMAIL_TOKEN_WORD,
                { expiresIn: VERIFY_EMAIL_TOKEN_LIFE }
            );

            await update_verify_token_service(token_for_verification, user_id, transaction);

            const custom_url = `http://${HOST}/${PATH_NAME_FOR_VERIFICATION_EMAIL}?email=${req.body.email}&id=${token_for_verification}`;
            await email_sender(req.body.email,
                { type_of_action: ACCOUNT_VERIFICATION, text: VERIFY_YOUR_ACCOUNT_TEXT },
                { user_name: req.body.name, custom_url });
            await transaction.commit();

            res.status(CREATED).json(new_user);
        } catch (e) {
            await transaction.rollback();
            next(e);
        }
    },

    update_user_controller: async (req, res, next) => {
        const transaction = await transactionInstance();
        try {
            const { user_id } = req.user;
            const { password, ...user } = req.body;
            const { avatar } = req;

            if (avatar) {
                const photo_extension = avatar.name.split('.').pop();
                const new_avatar_name = `${uuid}.${photo_extension}`;
                const avatar_path_without_public = path.join('users', `${user_id}`, 'avatar');
                const avatar_full_path = path.join(process.cwd(), 'source', 'public', avatar_path_without_public);
                const avatar_path = path.join(avatar_path_without_public, new_avatar_name);

                await fs.rmdir(path.join(avatar_path_without_public), { recursive: true });
                await fs.mkdir(path.join(avatar_full_path), { recursive: true });
                await avatar.mv(path.join(avatar_full_path, new_avatar_name));

                await update_user_avatar_service(avatar_path, user_id, transaction);
                await transaction.commit();
            }

            if (!password) {
                await update_user_service(user, user_id);

                return res.sendStatus(OK);
            }

            const new_password = await password_hasher(password);

            await update_user_service(user, user_id, new_password, transaction);
            await update_token_for_password_reset_service(null, user_id, transaction);
            await transaction.commit();

            res.sendStatus(OK);
        } catch (e) {
            await transaction.rollback();
            next(e);
        }
    },

    delete_user_controller: async (req, res, next) => {
        const transaction = await transactionInstance();

        try {
            const { user_id } = req.params;
            const deleted = true;

            await delete_user_service(user_id, transaction, deleted);
            await transaction.commit();

            res.status(NO_CONTENT).end();
        } catch (e) {
            await transaction.rollback();
            next(e);
        }
    },

};
