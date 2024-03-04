const fs = require("fs").promises;
const path = require("path");
const readline = require("readline");

const createModel = async (modelName) => {
    const modelsDir = path.join(__dirname, "../../models");
    const modelDir = path.join(modelsDir, modelName);
    const modelTsFilePath = path.join(modelDir, `${modelName}.ts`);
    const modelJsonFilePath = path.join(modelDir, `${modelName}.json`);

    try {
        await fs.access(modelDir);
        console.error(`${modelName}'s model already exists. Exiting...`);
        return;
    } catch (error) {}

    try {
        await createDirectory(modelsDir);
        await createDirectory(modelDir);
    } catch (error) {
        console.error(error);
        return;
    }

    const fields = await promptUser(); // Retrieve fields

    await generateFiles(modelName, modelTsFilePath, modelJsonFilePath, fields); // Pass fields to generateFiles
};

const createDirectory = async (dirPath, ignoreDuplicate = false) => {
    try {
        await fs.access(dirPath);
    } catch (error) {
        await fs.mkdir(dirPath);
    }
};

const generateFiles = async (modelName, modelTsFilePath, modelJsonFilePath, fields) => { // Add fields parameter
    try {
        const tsContent = `
        class ${modelName} extends Document {
            constructor(data: any) {
                super(data);
                this.validateModel(data);
            }

            private validateModel(data: any) {
                // Add validation for each field
                ${generateFieldValidations(modelName, fields)} // Pass fields to generateFieldValidations
            }
        }

        module.exports = ${modelName};
        `;
        await fs.writeFile(modelTsFilePath, tsContent);
        console.log(`Model TypeScript file '${modelName}.ts' created successfully.`);
    } catch (err) {
        console.error(`Error creating '${modelName}.ts': ${err}`);
        return;
    }

    try {
        const jsonContent = {
            name: `${modelName}`,
            fields: fields,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await fs.writeFile(
            modelJsonFilePath,
            JSON.stringify(jsonContent, null, 2)
        );
        if (fields.length === 0) {
            console.log(
                `No fields provided for model ${modelName}. Exiting...`
            );
            return;
        }
    } catch (err) {
        console.error(`Error creating '${modelName}.json': ${err}`);
        return;
    }
};

const generateFieldValidations = (modelName, fields) => {
    const validationCode = fields.map(field => {
        let validation = '';

        // Add validation for each field
        if (field.mandatory) {
            validation += `if (!data.${field.name}) {
                throw new Error("Field '${field.name}' is required.");
            }\n`;
        }

        // Add data type validation
        switch (field.type) {
            case 'string':
                validation += `if (typeof data.${field.name} !== 'string') {
                    throw new Error("Field '${field.name}' must be a string.");
                }\n`;
                break;
            case 'number':
                validation += `if (typeof data.${field.name} !== 'number' || !Number.isInteger(data.${field.name})) {
                    throw new Error("Field '${field.name}' must be an integer.");
                }\n`;
                break;
            case 'boolean':
                validation += `if (typeof data.${field.name} !== 'boolean') {
                    throw new Error("Field '${field.name}' must be a boolean.");
                }\n`;
                break;
            // Add more cases for additional data types if needed
            default:
                console.error(`Invalid data type '${field.type}' for field '${field.name}'.`);
        }

        return validation;
    }).join('\n');

    return validationCode;
};


const promptUser = () => {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const fields = [];

        const askField = () => {
            rl.question("\nDo you want to add a field? (y/N): ", (answer) => {
                if (answer.trim().toLowerCase() === "y") {
                    askFieldName();
                } else {
                    rl.close();
                    resolve(fields);
                }
            });
        };

        const askFieldName = () => {
            rl.question("Enter field name: ", (fieldName) => {
                const snakeCaseName = fieldName.trim().toLowerCase().replace(/\s+/g, '_');
                if (!snakeCaseName) {
                    console.log("Field name cannot be empty. Please provide a field name.");
                    askFieldName();
                    return;
                }
                if (fields.some(field => field.name === snakeCaseName)) {
                    console.log("Field name already exists. Please enter a unique field name.");
                    askFieldName();
                    return;
                }
                askDataType(snakeCaseName);
            });
        };

        const askDataType = (fieldName) => {
            rl.question("Enter data type (string, number, boolean): ", (dataType) => {
                if (!["string", "number", "boolean"].includes(dataType.trim().toLowerCase())) {
                    console.log("Invalid data type. Please enter 'string', 'number', or 'boolean'.");
                    askDataType(fieldName);
                    return;
                }
                askIsMandatory(fieldName, dataType.trim());
            });
        };

        const askIsMandatory = (fieldName, dataType) => {
            rl.question("Is it a mandatory field? (yes/no): ", (isMandatory) => {
                const mandatory = isMandatory.trim().toLowerCase() === "yes" || isMandatory.trim().toLowerCase() === "y";
                fields.push({
                    name: fieldName,
                    type: dataType,
                    mandatory: mandatory,
                });
                askField();
            });
        };

        askField();
    });
};

module.exports = createModel;
