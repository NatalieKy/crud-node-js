const jwt = require('jsonwebtoken');

const { ACCESS_TOKEN_WORD, REFRESH_TOKEN_WORD, VERIFY_EMAIL_TOKEN_WORD } = require('../../configs/config');
const { AUTHORIZATION } = require('../../configs/name_enums');
const { check_user_by_email_service, check_user_by_id_service } = require('../../services/user');
const { password_equlity_checker } = require('../../utilities/password_bcrypt');
const {
    get_user_and_token_pair_by_email_service,
    get_access_token_with_user_service,
    get_refresh_token_with_user_service,
    get_verify_token_with_user_service
} = require('../../services/token');
const { joi_validator_credentials } = require('../../validators/auth');
const { Error_handler } = require('../../errors/error_handler');
const { UNAUTHORIZED, INVALID_TOKEN, METHOD_NOT_ALLOWED, FORBIDDEN } = require('../../errors/error_types');
const { BAD_REQUEST } = require('../../configs/http_status_codes');

module.exports = {

    check_do_credentials_exist_middleware: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await check_user_by_email_service(email);

            if (!email || !password) {
                throw new Error_handler(UNAUTHORIZED.message, UNAUTHORIZED.code);
            }

            if (!user) {
                throw new Error_handler(UNAUTHORIZED.message, UNAUTHORIZED.code);
            }

            if (user.email !== email || !(await password_equlity_checker(password, user.password))) {
                throw new Error_handler(UNAUTHORIZED.message, UNAUTHORIZED.code);
            }

            req.user = user;

            next();
        } catch (e) {
            next(e);
        }
    },

    check_is_user_logged_middleware: async (req, res, next) => {
        try {
            const { email } = req.body;
            const user = await get_user_and_token_pair_by_email_service(email);

            if (user.Auth !== null) {
                throw new Error_handler(METHOD_NOT_ALLOWED.message, METHOD_NOT_ALLOWED.code);
            }

            req.user = user.dataValues;

            next();
        } catch (e) {
            next(e);
        }
    },

    check_are_credentials_correct: (req, res, next) => {
        try {
            const { error } = joi_validator_credentials.validate(req.body);

            if (error) {
                throw new Error_handler(error.details[0].message, BAD_REQUEST);
            }
            next();
        } catch (e) {
            next(e);
        }
    },

    check_access_token_middleware: async (req, res, next) => {
        try {
            const access_token = req.get(AUTHORIZATION);
            const { user_id } = req.params;

            if (!access_token) {
                throw new Error_handler(INVALID_TOKEN.message, INVALID_TOKEN.code);
            }

            jwt.verify(access_token, ACCESS_TOKEN_WORD, (err) => {
                if (err) {
                    throw new Error_handler(INVALID_TOKEN.message, INVALID_TOKEN.code);
                }
            });

            const user = await get_access_token_with_user_service(access_token);

            if (!user) {
                throw new Error_handler(INVALID_TOKEN.message, INVALID_TOKEN.code);
            }

            if (user.dataValues.user_id !== +user_id) {
                throw new Error_handler(FORBIDDEN.message, FORBIDDEN.code);
            }

            req.access_token = access_token;
            req.user = user;
            next();
        } catch (e) {
            next(e);
        }
    },

    check_is_status_active_middleware: async (req, res, next) => {
        try {
            const { user_id } = req.user;
            const user = await check_user_by_id_service(user_id);

            if (!user.dataValues.status) {
                throw new Error_handler(FORBIDDEN.message, FORBIDDEN.code);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    check_refresh_token_middleware: async (req, res, next) => {
        try {
            const refresh_token = req.get(AUTHORIZATION);
            const { user_id } = req.params;

            if (!refresh_token) {
                throw new Error_handler(INVALID_TOKEN.message, INVALID_TOKEN.code);
            }

            jwt.verify(refresh_token, REFRESH_TOKEN_WORD, (err) => {
                if (err) {
                    throw new Error_handler(INVALID_TOKEN.message, INVALID_TOKEN.code);
                }
            });

            const user = await get_refresh_token_with_user_service(refresh_token);

            if (!user) {
                throw new Error_handler(INVALID_TOKEN.message, INVALID_TOKEN.code);
            }

            if (user.dataValues.user_id !== +user_id) {
                throw new Error_handler(FORBIDDEN.message, FORBIDDEN.code);
            }

            req.user = user;

            next();
        } catch (e) {
            next(e);
        }
    },

    check_verify_token_middleware: async (req, res, next) => {
        try {
            const token = req.query.id;

            if (!token) {
                throw new Error_handler(INVALID_TOKEN.message, INVALID_TOKEN.code);
            }

            jwt.verify(token, VERIFY_EMAIL_TOKEN_WORD, async (err, decoded) => {
                if (err) {
                    throw new Error_handler(INVALID_TOKEN.message, INVALID_TOKEN.code);
                } else {
                    const { id } = decoded.id;
                    const user = await get_verify_token_with_user_service(token);

                    if (!user) {
                        throw new Error_handler(INVALID_TOKEN.message, INVALID_TOKEN.code);
                    }

                    if (user.dataValues.user_id !== +id) {
                        throw new Error_handler(FORBIDDEN.message, FORBIDDEN.code);
                    }
                }
            });

            const user = await get_verify_token_with_user_service(token);

            req.user = user.dataValues;

            next();
        } catch (e) {
            next(e);
        }
    },

};
