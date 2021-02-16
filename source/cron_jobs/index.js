const cron = require('node-cron');

const { CRONE_00_00_EVERY_DAY } = require('../configs/constants');
const { cron_service: { deleteRefreshTokenAfterExpiration } } = require('../services');

module.exports = {
    delete_tokens_after_one_week: () => {
        cron.schedule(CRONE_00_00_EVERY_DAY, async () => {
            await deleteRefreshTokenAfterExpiration();
        });
    }
};
