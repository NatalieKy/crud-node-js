const { MINIMUM_AGE, USER_PRIMARY_KEY } = require('../../configs/constants');
const { CASCADE, FEMALE, MALE, AUTHENTICATION_TABLE, USERS_TABLE, USER_MODEL } = require('../../configs/name_enums');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(USERS_TABLE, {
            user_id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                unique: true,
                allowNull: false,
                autoIncrement: true,
            },
            active: {
                type: Sequelize.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            name: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                isAlpha: true,
            },
            surname: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                isAlpha: true,
            },
            age: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                isNumeric: true,
                min: MINIMUM_AGE,
            },
            gender: {
                type: Sequelize.DataTypes.STRING,
                isIn: [[
                    MALE,
                    FEMALE
                ]],
                allowNull: false
            },
            email: {
                type: Sequelize.DataTypes.STRING,
                isEmail: true,
                allowNull: false
            },
            password: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            deleted: {
                type: Sequelize.DataTypes.BOOLEAN,
            },
            avatar: {
                type: Sequelize.DataTypes.STRING,
            },
            token_for_verification: {
                type: Sequelize.DataTypes.STRING,
            }
        },);

        await queryInterface.createTable(AUTHENTICATION_TABLE, {
            auth_id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                unique: true,
                autoIncrement: true,
                allowNull: false
            },
            access_token: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            refresh_token: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            user_id: {
                type: Sequelize.DataTypes.INTEGER,
                foreignKey: true,
                onDelete: CASCADE,
                onUpdate: CASCADE,
                references: {
                    model: USERS_TABLE,
                    key: USER_PRIMARY_KEY
                },
            },
            created_at: {
                type: Sequelize.DataTypes.DATE,
                defaultValue: Sequelize.fn('NOW')
            }
        },);
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable(USERS_TABLE);
        await queryInterface.dropTable(AUTHENTICATION_TABLE);
    }
};
