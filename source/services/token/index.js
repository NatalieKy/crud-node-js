const { Op } = require('sequelize');

const dataBase = require('../../dataBase_SQL').getInstance();
const {
    name_enums: { AUTH_MODEL, USER_MODEL },
    constants: { ONE_WEEK }
} = require('../../configs');

module.exports = {

    create_token_pair_service: (tokens, transaction) => {
        const Auth = dataBase.getModel(AUTH_MODEL);

        return Auth.create(tokens, { transaction });
    },

    get_access_token_with_user_service: (access_token) => {
        const Auth = dataBase.getModel(AUTH_MODEL);
        const User = dataBase.getModel(USER_MODEL);

        return User.findOne({
            include: {
                model: Auth,
                where: { access_token }
            }
        });
    },

    get_refresh_token_with_user_service: (refresh_token) => {
        const Auth = dataBase.getModel(AUTH_MODEL);
        const User = dataBase.getModel(USER_MODEL);

        return User.findOne({
            include: {
                model: Auth,
                where: { refresh_token }
            }
        });
    },

    get_verify_token_with_user_service: (token) => {
        const User = dataBase.getModel(USER_MODEL);

        return User.findOne({
            where: { token_for_verification: token }
        });
    },

    delete_refresh_token_service: () => {
        const Auth = dataBase.getModel(AUTH_MODEL);
        return Auth.destroy({
            where: {
                created_at: {
                    [Op.gt]: new Date(new Date() - ONE_WEEK)
                }
            }
        });
    },

    get_user_and_token_pair_by_email_service: (email) => {
        const Auth = dataBase.getModel(AUTH_MODEL);
        const User = dataBase.getModel(USER_MODEL);

        return User.findOne({
            where: { email },
            include: {
                model: Auth
            }
        });
    },

    get_refresh_token_service: (refresh_token) => {
        const Auth = dataBase.getModel(AUTH_MODEL);

        return Auth.findOne({
            where: { refresh_token }
        });
    },

    delete_token_pair_by_access_token_service: (access_token, transaction) => {
        const Auth = dataBase.getModel(AUTH_MODEL);

        return Auth.destroy({
            where: { access_token },
            transaction
        });
    },

    check_tokens_presence_in_db_service: (refresh_token) => {
        const Auth = dataBase.getModel(AUTH_MODEL);

        return Auth.findOne({
            where: { refresh_token }
        });
    },

    delete_token_pair_by_user_id: (user_id, transaction) => {
        const Auth = dataBase.getModel(AUTH_MODEL);

        return Auth.destroy({
            where: { user_id },
            transaction
        });
    }

};
