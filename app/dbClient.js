const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    //host: "localhost",
    host: "ec2-34-241-90-235.eu-west-1.compute.amazonaws.com",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    define: {
      updatedAt: "updated_at",
      createdAt: "created_at"
    },
  }
);

module.exports = sequelize;