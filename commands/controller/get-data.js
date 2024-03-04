const connectToDatabase = require("../../utils/database");

async function tableExists(db, tableName) {
  try {
    const tableNames = await db.getQueryInterface().showAllTables();
    return tableNames.includes(`tab${tableName}s`);
  } catch (error) {
    console.error("Error checking table existence:", error);
    return false;
  }
}

exports.getData = async (req, res) => {
  try {
    const { modelName, fields, filters } = req.query;

    if (!modelName) {
      throw new Error("Model name is required");
    }

    const db = await connectToDatabase();
    const exists = await tableExists(db, modelName);
    if (!exists) {
      return res.json({
        error: true,
        message: `Table '${modelName}' does not exist.`,
      });
    }

    let query = `SELECT ${Array.isArray(fields) ? fields.join(", ") : "*"} FROM tab${modelName}s`;

    if (filters) {
      const filterObject = JSON.parse(filters);
      const conditions = [];

      for (const [key, [operator, value]] of Object.entries(filterObject)) {
        switch (operator) {
          case "==":
            conditions.push(`${key} = '${value}'`);
            break;
          case ">=":
            conditions.push(`${key} >= '${value}'`);
            break;
          default:
            conditions.push(`${key} = '${value}'`);
        }
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
      }
    }

    const results = await db.query(query, {
      type: db.QueryTypes.SELECT, 
    });

    res.status(200).json({ results });
  } catch (error) {
    console.error("Error getting data:", error);
    res.status(400).send(error.message);
  }
};
