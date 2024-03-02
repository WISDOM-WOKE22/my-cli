const { program } = require('commander');
const fs = require('fs').promises;
const path = require('path');

program
  .command('create-model <modelName>')
  .action(async (modelName) => {
    const modelsDir = path.join(__dirname, 'models');
    const modelDir = path.join(modelsDir, modelName);
    const modelTsFilePath = path.join(modelDir, `tab${modelName}.ts`);
    const modelJsonFilePath = path.join(modelDir, `tab${modelName}.json`);

    try {
      await fs.access(modelsDir); // Check if models directory exists
    } catch (error) {
      // Models directory doesn't exist
      console.log("Creating models directory...");
      try {
        await fs.mkdir(modelsDir); // Create models directory
        console.log("Models directory created successfully.");
      } catch (err) {
        console.error(`Error creating models directory: ${err}`);
        return;
      }
    }

    try {
      await fs.access(modelDir); // Check if model directory exists
      console.error(`Model '${modelName}' already exists!`);
    } catch (error) {
      // Model directory doesn't exist
      console.log("Creating model directory...");
      try {
        await fs.mkdir(modelDir); // Create model directory
        console.log(`Model directory '${modelName}' created successfully.`);
        // Write model files
        try {
          await fs.writeFile(modelTsFilePath, `
            // Define your model class extending Document
          `);
          console.log(`Model TypeScript file '${modelName}.ts' created successfully.`);
        } catch (err) {
          console.error(`Error creating model TypeScript file: ${err}`);
        }

        try {
          await fs.writeFile(modelJsonFilePath, `
            {
              "fields": [
                { "firstName": "string", "LastName": "string","type": "string", "required": true },
              ]
            }
          `);
          console.log(`Model JSON file '${modelName}.json' created successfully.`);
        } catch (err) {
          console.error(`Error creating model JSON file: ${err}`);
        }
      } catch (err) {
        console.error(`Error creating model directory: ${err}`);
      }
    }
    
    // Code here will continue executing after checking/creating the directories and writing files
    console.log("Continuing execution...");
  });

program.parse(process.argv);
