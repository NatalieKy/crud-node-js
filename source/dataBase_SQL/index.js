const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const { DB_USERNAME, DB_PASSWORD, DB_NAME, HOST_NAME } = require('../configs/config');
const { DIALECT } = require('../configs/constants');

module.exports = (() => {
    let instance;

    function initConnection() {
        const client = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
            host: HOST_NAME,
            dialect: DIALECT
        });

        const models = {};
        const modelsPath = path.join(process.cwd(), 'source', 'dataBase_SQL', 'models');

        function getModels() {
            fs.readdir(modelsPath, (err, files) => {
                files.forEach((file) => {
                    const [model] = file.split('.');
                    const modelFile = require(path.join(`${modelsPath}`, model));
                    models[model] = modelFile(client, DataTypes);
                });
            });
        }

        return {
            setModels: () => getModels(),
            getModel: (modelName) => models[modelName],
            transactionInstance: () => client.transaction()
        };
    }

    return {
        getInstance: () => {
            if (!instance) {
                instance = initConnection();
            }

            return instance;
        }
    };
})();
