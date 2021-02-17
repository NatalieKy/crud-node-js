const { Router } = require('express');

const { login_controller, logout_controller, refresh_token_usage_controller, verification_controller,
    password_restoring_controller
} = require('../../controllers/auth');
const {
    auth_middleware: { check_access_token_middleware, check_refresh_token_middleware, check_verify_token_middleware,
        check_do_credentials_exist_middleware, check_is_user_logged_middleware, check_reset_password_token_middleware,
        check_is_status_active_middleware },
    user_middleware: { check_user_id_validity_middleware, check_user_in_db_by_email_middleware,
        check_new_password_middleware, check_updated_user_middleware }
} = require('../../middleware');
const { user_controller: { update_user_controller } } = require('../../controllers');

const auth_router = Router();

auth_router.get('/verify',
    check_verify_token_middleware,
    verification_controller);
auth_router.put('/forgot_password',
    check_user_in_db_by_email_middleware,
    password_restoring_controller);
auth_router.put('/password_reset',
    check_updated_user_middleware,
    check_reset_password_token_middleware,
    check_new_password_middleware,
    update_user_controller);
auth_router.post('/login',
    check_is_user_logged_middleware,
    check_do_credentials_exist_middleware,
    check_is_status_active_middleware,
    login_controller);
auth_router.delete('/logout/:user_id',
    check_user_id_validity_middleware,
    check_access_token_middleware,
    logout_controller);
auth_router.post('/refresh/:user_id',
    check_user_id_validity_middleware,
    check_refresh_token_middleware,
    refresh_token_usage_controller);

module.exports = auth_router;
