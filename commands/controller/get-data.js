const connectToDatabase = require("../../utils/database");

async function tableExists(db, tableName) {
  try {
    // Get all table names from Sequelize's metadata
    const tableNames = await db.getQueryInterface().showAllTables();
    return tableNames.includes(`tab${tableName}`);
  } catch (error) {
    console.error("Error checking table existence:", error);
    return false; // Return false in case of error
  }
}

exports.getData = async (req, res) => {
  try {
    const { modelName, fields, filters } = req.query;

    // Validate required parameters
    if (!modelName) {
      throw new Error("Model name is required");
    }

    // Check if the table exists in the database
    const db = await connectToDatabase();
    const exists = await tableExists(db, modelName);
    if (!exists) {
      return res.json({
        error: true,
        message: `Table '${modelName}' does not exist.`,
      });
    }

    // Construct the base query
    let query = `SELECT ${Array.isArray(fields) ? fields.join(", ") : "*"} FROM tab${modelName}`;

    // Checking if filter parameters are provided
    if (filters) {
      const filterObject = JSON.parse(filters);
      const conditions = [];

      // Loop through each filter
      for (const [key, [operator, value]] of Object.entries(filterObject)) {
        switch (operator) {
          case "==":
            conditions.push(`${key} = '${value}'`);
            break;
          case ">=":
            conditions.push(`${key} >= '${value}'`);
            break;
          // Add more cases for other operators as needed
          default:
            // By default, assume equality
            conditions.push(`${key} = '${value}'`);
        }
      }

      // Adding WHERE clause if conditions are provided
      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
      }
    }

    // Execute the raw SQL query
    const results = await db.query(query, {
      type: db.QueryTypes.SELECT, // Specify the type of query (SELECT, INSERT, UPDATE, DELETE)
    });

    res.status(200).json({ results });
  } catch (error) {
    console.error("Error getting data:", error);
    res.status(400).send(error.message);
  }
};
