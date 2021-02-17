const { transactionInstance } = require('../../dataBase_SQL').getInstance();
const { NO_CONTENT, OK } = require('../../configs');
const { tokens_creator } = require('../../utilities');
const {
    user: { update_user_status_service },
    token_service: { create_token_pair_service, delete_token_pair_by_access_token_service, delete_token_pair_by_user_id }
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
            const { user_id } = req;

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
