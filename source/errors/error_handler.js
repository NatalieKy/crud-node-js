module.exports = {
    Error_handler: class Error_handler extends Error {
        constructor(message, code) {
            super(message);
            this.code = code;

            Error.captureStackTrace(this, this.constructor);
        }
    }
};
