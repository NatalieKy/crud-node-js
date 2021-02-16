module.exports = {
    ACCESS_TOKEN_LIFE: '1d',
    CARS_FOREIGN_KEY: 'student_id',
    CARS_PRIMARY_KEY: 'id',
    CRONE_00_00_EVERY_DAY: '0 0 * * *',
    FILES_FOREIGN_KEY: 'carID',
    DIALECT: 'mysql',
    HOST: 'localhost:5000',
    MINIMUM_AGE: 1,
    AUTH_FOREIGN_KEY: 'user_id',
    PATH_NAME_FOR_VERIFICATION_EMAIL: 'auth/verify',
    PHOTOS_MIMETYPES: [
        'image/jpeg',
        'image/pjpeg',
        'image/png'
    ],
    PHOTOS_MAX_SIZE: (5 * 1024 * 1024),
    REFRESH_TOKEN_LIFE: '7d',
    VERIFY_EMAIL_TOKEN_LIFE: '1d',
    SCOPE_EXCLUDE_PASSWORD: 'noPassword',
    USER_PRIMARY_KEY: 'user_id',
    USER_PASSWORD: 'password',
    ONE_WEEK: 7 * 24 * 60 * 60 * 1000
};
