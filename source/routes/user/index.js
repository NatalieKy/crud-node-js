const { Router } = require('express');

const { check_access_token_middleware, check_is_status_active_middleware } = require('../../middleware/auth');
const {
    check_is_user_deleted,
    check_user_id_validity_middleware,
    check_updated_user_middleware,
    check_new_user_middleware,
    check_user_by_email_middleware,
    check_user_by_id_middleware,
    check_is_student_photo_single,
    check_photo_type,
} = require('../../middleware/user');

const user_router = Router();

const {
    get_user_controller,
    create_user_controller,
    update_user_controller,
    delete_user_controller,
} = require('../../controllers/user');

user_router.use('/:user_id',
    check_user_id_validity_middleware,
    check_is_user_deleted,
    check_user_by_id_middleware,
    check_is_status_active_middleware,
    check_access_token_middleware);

user_router.get('/:user_id',
    get_user_controller);
user_router.post('/',
    check_new_user_middleware,
    check_user_by_email_middleware,
    check_photo_type,
    check_is_student_photo_single,
    create_user_controller);
user_router.put('/:user_id',
    check_updated_user_middleware,
    check_photo_type,
    check_is_student_photo_single,
    update_user_controller);
user_router.delete('/:user_id',
    delete_user_controller);

module.exports = user_router;
