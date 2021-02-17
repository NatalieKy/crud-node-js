const database = require('../../dataBase_SQL').getInstance();
const {
    constants: { SCOPE_EXCLUDE_PASSWORD },
    name_enums: { USER_MODEL }
} = require('../../configs');

module.exports = {

    get_user_service: (user_id) => {
        const User = database.getModel(USER_MODEL);

        return User.scope(SCOPE_EXCLUDE_PASSWORD).findOne({
            where: { user_id },
        });
    },

    create_user_service: (user, hashed_password, active, transaction) => {
        const User = database.getModel(USER_MODEL);

        return User.create({
            name: user.name,
            surname: user.surname,
            email: user.email,
            age: user.age,
            gender: user.gender,
            deleted: false,
            active: false,
            password: hashed_password,
        }, {
            transaction
        });
    },

    update_user_service: (user, user_id, new_password, transaction) => {
        const User = database.getModel(USER_MODEL);

        return User.update({
            name: user.name,
            email: user.email,
            age: user.age,
            gender: user.gender,
            password: new_password
        }, { where: { user_id }, transaction });
    },

    update_user_avatar_service: (avatar, user_id, transaction) => {
        const User = database.getModel(USER_MODEL);

        return User.update({
            avatar
        }, { where: { user_id },
            returning: true,
            transaction
        });
    },

    delete_user_service: (user_id, transaction, deleted) => {
        const User = database.getModel(USER_MODEL);

        return User.update({
            deleted
        }, { where: { user_id },
            transaction
        });
    },

    update_verify_token_service: (token_for_verification, user_id, transaction) => {
        const User = database.getModel(USER_MODEL);

        return User.update({
            token_for_verification
        }, { where: { user_id },
            transaction
        });
    },

    update_user_status_service: (user_id, transaction) => {
        const User = database.getModel(USER_MODEL);

        return User.update({
            active: true
        }, { where: { user_id },
            transaction
        });
    },

    check_user_by_email_service: (email) => {
        const User = database.getModel(USER_MODEL);

        return User.findOne({
            where: {
                email
            }
        });
    },

    check_user_by_id_service: (user_id) => {
        const User = database.getModel(USER_MODEL);

        return User.findOne({
            where: { user_id }
        });
    },
};
