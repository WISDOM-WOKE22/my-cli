const fs = require("fs").promises;
const path = require("path");
const readline = require("readline");
const migrate = require("../migrate");

async function addData(modelName, db) {
  const modelsDir = path.join(__dirname, "../../models");
  const modelJsonFilePath = path.join(
    modelsDir,
    modelName,
    `${modelName}.json`
  );

  let modelData;
  try {
    modelData = JSON.parse(await fs.readFile(modelJsonFilePath, "utf8"));
  } catch (error) {
    console.error(`Error reading model JSON file for '${modelName}':`, error);
    return;
  }

  const data = {};
  try {
    for (const field of modelData.fields) {
      const value = await promptFieldValue(field);
      data[field.name] = value;
    }
    console.log({ data });
    const Model = await migrate(modelName, data);
    console.log("Database & tables created!");
  } catch (error) {
    console.error(`Error creating data for '${modelName}':`, error);
    return;
  }
}

async function promptFieldValue(field) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const promptUser = () => {
      rl.question(
        `Enter value for ${field.name} (${field.type}): `,
        (value) => {
          if (value.trim() === "" && field.mandatory) {
            console.error(`Field '${field.name}' is mandatory.`);
            promptUser();
          } else {
            if (!isValidType(value, field.type)) {
              console.error(
                `Invalid data type for field '${field.name}'. Expected ${field.type}.`
              );
              promptUser();
            } else {
              rl.close();
              resolve(value);
            }
          }
        }
      );
    };

    promptUser();
  });
}

function isValidType(value, type) {
  switch (type) {
    case "string":
      return typeof value === "string";
    case "number":
      return !isNaN(Number(value));
      case 'boolean':
        return ['true', 'false', '1', '0'].includes(value.toLowerCase());
    default:
      return true;
  }
}

module.exports = addData;
