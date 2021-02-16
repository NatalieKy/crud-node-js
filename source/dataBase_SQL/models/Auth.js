const { USER_PRIMARY_KEY } = require('../../configs/constants');
const { AUTHENTICATION_TABLE, AUTH_MODEL, USER_MODEL } = require('../../configs/name_enums');

module.exports = (client, DataTypes) => {
    const Auth = client.define(AUTH_MODEL, {
        auth_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        access_token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        refresh_token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: client.NOW
        },
        user_id: {
            type: DataTypes.NUMBER,
            allowNull: false,
            foreignKey: true,
            references: {
                model: USER_MODEL,
                key: USER_PRIMARY_KEY
            }
        },
    }, {
        tableName: AUTHENTICATION_TABLE,
        timestamps: false
    });

    return Auth;
};
