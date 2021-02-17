const jwt = require('jsonwebtoken');

const {
    constants: { ACCESS_TOKEN_LIFE, REFRESH_TOKEN_LIFE },
    config: { ACCESS_TOKEN_WORD, REFRESH_TOKEN_WORD }
} = require('../configs');

module.exports = () => {
    const access_token = jwt.sign({}, ACCESS_TOKEN_WORD, { expiresIn: ACCESS_TOKEN_LIFE });
    const refresh_token = jwt.sign({}, REFRESH_TOKEN_WORD, { expiresIn: REFRESH_TOKEN_LIFE });

    return {
        access_token,
        refresh_token,
    };
};
