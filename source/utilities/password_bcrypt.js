const bcrypt = require('bcrypt');

const {
    error_handler: { ErrorHandler },
    error_types: { NOT_VALID_CREDENTIALS }
} = require('../errors');

module.exports = {
    password_hasher: (password) => bcrypt.hash(password, 10),
    password_equlity_checker: async (password, hash) => {
        const is_password_true = await bcrypt.compare(password, hash);

        if (!is_password_true) {
            throw new ErrorHandler(NOT_VALID_CREDENTIALS.message, NOT_VALID_CREDENTIALS.code);
        }

        return is_password_true;
    }
};
