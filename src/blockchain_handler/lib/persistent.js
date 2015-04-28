require('dotenv').load();

var Sequelize = require('sequelize')
  , db = new Sequelize(null, null, null, {
    dialect: 'sqlite',
    storage: process.env.DATABASE
  });

var Transaction = exports.Transaction = db.define('transaction', {
  magicNo:            Sequelize.STRING,
  transactionId:      { type: Sequelize.STRING, unique: true, primaryKey: true },
  parentId:           Sequelize.STRING,
  type:               Sequelize.INTEGER,
  scriptSig:          Sequelize.STRING,
  hostname:           Sequelize.STRING,
  snapshotRef:        Sequelize.STRING,
  snapshotChecksum:   Sequelize.STRING,
  responseChecksums:  Sequelize.STRING
});

