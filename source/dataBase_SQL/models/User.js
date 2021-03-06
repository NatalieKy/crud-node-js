const {
    constants: { MINIMUM_AGE, USER_PASSWORD, AUTH_FOREIGN_KEY },
    name_enums: { CASCADE, FEMALE, MALE, USER_MODEL, USERS_TABLE }
} = require('../../configs');

module.exports = (client, DataTypes) => {
    const User = client.define(USER_MODEL, {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            isAlpha: true,
        },
        surname: {
            type: DataTypes.STRING,
            allowNull: false,
            isAlpha: true,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
            isNumeric: true,
            min: MINIMUM_AGE,
        },
        gender: {
            type: DataTypes.STRING,
            isIn: [[
                MALE,
                FEMALE
            ]],
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            isEmail: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        deleted: {
            type: DataTypes.BOOLEAN,
        },
        avatar: {
            type: DataTypes.STRING,
        },
        token_for_verification: {
            type: DataTypes.STRING
        },
        token_for_password_reset: {
            type: DataTypes.STRING
        }
    }, {
        tableName: USERS_TABLE,
        timestamps: false,
        scopes: {
            noPassword: {
                attributes: { exclude: [USER_PASSWORD] },
            }
        }
    });

    const Auth = require('./Auth')(client, DataTypes);

    User.hasOne(Auth, {
        foreignKey: AUTH_FOREIGN_KEY,
        onDelete: CASCADE,
        onUpdate: CASCADE
    });

    return User;
};
