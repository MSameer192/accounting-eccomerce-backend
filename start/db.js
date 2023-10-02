const {
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_DIALECT,
} = require("../config/env");
const Sequelize = require("sequelize");

// Sequelize database connecting
const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
});

sequelize
  .sync({ alter: true, logging: false })
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

module.exports = sequelize;
