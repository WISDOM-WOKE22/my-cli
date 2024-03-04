const { Sequelize } = require("sequelize");

async function connectToDatabase() {
    try {
        const db = new Sequelize({
            dialect: "sqlite",
            storage: "./db.sqlite",
        });

        // db.getDatabaseName

        await db.authenticate();
        console.log("Database connection has been established successfully.");

        return db;
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        throw error;
    }
}

module.exports = connectToDatabase;