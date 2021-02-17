const {
    http_status_codes: { BAD_REQUEST },
    constants: { PHOTOS_MIMETYPES, PHOTOS_MAX_SIZE }
} = require('../../configs');
const {
    error_handler: { Error_handler },
    error_types: { EMAIL_ALREADY_USED, NO_USER_FOUND, TOO_MANY_USER_PHOTOS, TOO_BIG_PHOTO }
} = require('../../errors');
const { joi_validator_create_user, joi_validator_update_user, joi_validator_user_id } = require('../../validators/user');
const { check_user_by_email_service, check_user_by_id_service } = require('../../services/user');

module.exports = {

    check_is_user_deleted: async (req, res, next) => {
        try {
            const { user_id } = req.params;
            const user = await check_user_by_id_service(user_id);

            if (user.dataValues.deleted === true) {
                throw new Error_handler(NO_USER_FOUND.message, NO_USER_FOUND.code);
            }

            req.user = user.dataValues;
            next();
        } catch (e) {
            next(e);
        }
    },

    check_new_user_middleware: (req, res, next) => {
        try {
            const { error } = joi_validator_create_user.validate(req.body);

            if (error) {
                throw new Error_handler(error.details[0].message, BAD_REQUEST);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    check_updated_user_middleware: (req, res, next) => {
        try {
            const { error } = joi_validator_update_user.validate(req.body);

            if (error) {
                throw new Error_handler(error.details[0].message, BAD_REQUEST);
            }
            next();
        } catch (e) {
            next(e);
        }
    },

    check_user_by_email_middleware: async (req, res, next) => {
        try {
            const { email } = req.body;
            console.log(req.user);
            const user = await check_user_by_email_service(email);

            if (user) {
                throw new Error_handler(EMAIL_ALREADY_USED.message, EMAIL_ALREADY_USED.code);
            }
            next();
        } catch (e) {
            next(e);
        }
    },

    check_user_by_id_middleware: (req, res, next) => {
        try {
            const { user } = req;

            if (!user) {
                throw new Error_handler(NO_USER_FOUND.message, NO_USER_FOUND.code);
            }

            req.user = user;
            next();
        } catch (e) {
            next(e);
        }
    },

    check_user_id_validity_middleware: (req, res, next) => {
        try {
            const { error } = joi_validator_user_id.validate(req.params.user_id);

            if (error) {
                throw new Error_handler(error.details[0].message, BAD_REQUEST);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    check_photo_type: (req, res, next) => {
        try {
            const { files } = req;
            if (files) {
                const photos = [];
                const filesPackage = Object.values(files);

                for (let file = 0; file < filesPackage.length; file++) {
                    const { mimetype, size } = filesPackage[file];

                    if (PHOTOS_MIMETYPES.includes(mimetype)) {
                        if (size > PHOTOS_MAX_SIZE) {
                            throw new Error_handler(TOO_BIG_PHOTO.message, TOO_BIG_PHOTO.code);
                        }

                        photos.push(filesPackage[file]);
                    }
                }
                req.photos = photos;
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    check_is_student_photo_single: (req, res, next) => {
        try {
            if (req.photos) {
                if (req.photos.length > 1) {
                    throw new Error_handler(TOO_MANY_USER_PHOTOS.message, TOO_MANY_USER_PHOTOS.code);
                }

                const [avatar] = req.photos;
                req.avatar = avatar;
            }

            next();
        } catch (e) {
            next(e);
        }
    },
};
