const { delete_refresh_token_service } = require('../token');

module.exports = {
    deleteRefreshTokenAfterExpiration: async () => {
        await delete_refresh_token_service();
    }
};
