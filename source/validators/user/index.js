const joi = require('joi');

const { GENDER, EMAIL, NAME, PASSWORD } = require('../../configs/reg_exp');

module.exports = {

    joi_validator_user_id: joi.number()
        .integer()
        .min(1)
        .required(),

    joi_validator_password: joi.string()
        .regex(PASSWORD)
        .required(),

    joi_validator_create_user: joi.object({
        name: joi.string()
            .regex(NAME)
            .required(),
        surname: joi.string()
            .regex(NAME)
            .required(),
        age: joi.number()
            .min(1)
            .max(100)
            .required(),
        gender: joi.string()
            .regex(GENDER)
            .required(),
        email: joi.string()
            .regex(EMAIL)
            .required(),
        deleted: joi.bool(),
        password: joi.string()
            .regex(PASSWORD)
            .required()
    }),

    joi_validator_update_user: joi.object({
        name: joi.string()
            .regex(NAME)
            .min(2)
            .optional(),
        surname: joi.string()
            .regex(NAME)
            .min(2)
            .optional(),
        age: joi.number()
            .min(1)
            .max(100)
            .optional(),
        gender: joi.string()
            .regex(GENDER)
            .optional(),
        email: joi.string()
            .regex(EMAIL)
            .optional(),
        password: joi.string()
            .regex(PASSWORD)
            .optional(),
    }),
};
