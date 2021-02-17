const jwt = require('jsonwebtoken');

const { transactionInstance } = require('../../dataBase_SQL').getInstance();
const {
    http_status_codes: { NO_CONTENT, OK },
    constants: { PATH_NAME_FOR_FORGOT_PASSWORD_EMAIL, HOST, RESET_PASSWORD_TOKEN_LIFE, FORGOT_PASSWORD_TEXT },
    config: { RESET_PASSWORD_TOKEN_WORD },
    email_events: { PASSWORD_RESTORING }
} = require('../../configs');
const {
    tokens_creator,
} = require('../../utilities');
const {
    user_services: { update_user_status_service,
        update_token_for_password_reset_service },
    token_service: { create_token_pair_service, delete_token_pair_by_access_token_service, delete_token_pair_by_user_id },
    email_sender_services: { email_sender }
} = require('../../services');

module.exports = {

    login_controller: async (req, res, next) => {
        const transaction = await transactionInstance();
        try {
            const { user_id } = req.user;
            const tokens = tokens_creator();

            Object.assign(tokens, { user_id });

            await create_token_pair_service(tokens, transaction);
            await transaction.commit();

            res.json(tokens);
        } catch (e) {
            await transaction.rollback();
            next(e);
        }
    },

    password_restoring_controller: async (req, res, next) => {
        const transaction = await transactionInstance();

        try {
            const { user } = req;
            const { user_id } = user;

            const id = { id: user_id };
            const token_for_password_reset = await jwt.sign(
                { id }, RESET_PASSWORD_TOKEN_WORD,
                { expiresIn: RESET_PASSWORD_TOKEN_LIFE }
            );

            await update_token_for_password_reset_service(token_for_password_reset, user_id, transaction);

            const custom_url = `http://${HOST}/${PATH_NAME_FOR_FORGOT_PASSWORD_EMAIL}?email=${user.email}&id=${token_for_password_reset}`;

            await email_sender(user.email,
                { type_of_action: PASSWORD_RESTORING, text: FORGOT_PASSWORD_TEXT },
                { user_name: user.name, custom_url });

            await transaction.commit();

            res.json(OK);
        } catch (e) {
            await transaction.rollback();
            next(e);
        }
    },

    verification_controller: async (req, res, next) => {
        const transaction = await transactionInstance();
        try {
            const { user_id } = req.user;

            await update_user_status_service(user_id, transaction);
            await transaction.commit();

            res.json(OK);
        } catch (e) {
            await transaction.rollback();
            next(e);
        }
    },

    logout_controller: async (req, res, next) => {
        const transaction = await transactionInstance();
        try {
            const { access_token } = req;

            await delete_token_pair_by_access_token_service(access_token, transaction);
            await transaction.commit();

            res.json(NO_CONTENT);
        } catch (e) {
            await transaction.rollback();
            next(e);
        }
    },

    refresh_token_usage_controller: async (req, res, next) => {
        const transaction = await transactionInstance();
        try {
            const { user_id } = req.user;

            await delete_token_pair_by_user_id(user_id);

            const new_tokens = tokens_creator();

            Object.assign(new_tokens, { user_id });

            await create_token_pair_service(new_tokens, transaction);
            await transaction.commit();

            res.json(new_tokens);
        } catch (e) {
            await transaction.rollback();
            next(e);
        }
    }
};
