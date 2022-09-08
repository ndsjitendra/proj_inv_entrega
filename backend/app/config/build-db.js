const Sequelize = require("sequelize");
const dbConfig = require('./db.config');

const UserModel = require('../models/user.model');
const CompresorModel = require('../models/compresor.model');
const RecordModel = require('../models/record.model');
const AdminModel = require('../models/admin.model');
const PaymentModel = require('../models/payments.model');
const DistributorModel = require('../models/distributor.model');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, { host: dbConfig.HOST, dialect: dbConfig.DIALECT });
const db = {};
/*
* Define new Models here
*
*/
const User = UserModel(sequelize, Sequelize);
const Compresor = CompresorModel(sequelize, Sequelize);
const Record = RecordModel(sequelize, Sequelize);
const Admin = AdminModel(sequelize, Sequelize);
const Payment = PaymentModel(sequelize, Sequelize);
const Distributor = DistributorModel(sequelize, Sequelize);
/*
* Initialize DB
*
*/

db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize.sync({ alter: true }).then(() => {
    console.log("SYNCED TABLES");
});


module.exports = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection succesful");
    } catch (error) {
        console.log("ERROR", error);
    }

    process.on('SIGINT', () => {
        sequelize.close(() => {
            console.log("Connection close");
            process.exit(0);
        })
    })
}

module.exports = {
    User,
    Compresor,
    Record,
    Admin,
    Payment,
    Distributor,
    db
}

