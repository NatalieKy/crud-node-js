const joi = require('joi');

const { EMAIL, PASSWORD } = require('../../configs/reg_exp');

module.exports = {

    joi_validator_credentials: joi.object({
        email: joi.string()
            .regex(EMAIL)
            .required(),
        password: joi.string()
            .regex(PASSWORD)
            .required()
    })
};
