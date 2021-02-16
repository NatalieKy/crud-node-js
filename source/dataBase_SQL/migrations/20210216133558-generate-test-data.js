const { password_hasher } = require('../../utilities/password_bcrypt');
const { USERS_TABLE } = require('../../configs/name_enums');

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert(USERS_TABLE, [
            {
                active: false,
                name: 'Viktor',
                surname: 'Fazer',
                age: 26,
                gender: 'male',
                email: 'viktor@gmail.com',
                password: await password_hasher('Qwerty123'),
                deleted: false,
                avatar: null
            },
            {
                active: false,
                name: 'Iron',
                surname: 'Bird',
                age: 24,
                gender: 'female',
                email: 'ironbird@gmail.com',
                password: await password_hasher('Qwerty321'),
                deleted: false,
                avatar: null
            },
            {
                active: false,
                name: 'Olga',
                surname: 'Ivashkiv',
                age: 25,
                gender: 'female',
                email: 'olya@gmail.com',
                password: await password_hasher('Qwerty132'),
                deleted: false,
                avatar: null
            },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete(USERS_TABLE, null, {});
    },
};
