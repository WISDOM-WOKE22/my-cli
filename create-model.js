const { program } = require('commander');

program
  .command('create-model <modelName>')
  .action(async (modelName) => {
    const fs = require('fs');
    const path = require('path');

    const modelDir = path.join(__dirname, 'models', modelName);

    if (fs.existsSync(modelDir)) {
      console.error(`Model '${modelName}' already exists!`);
      return;
    }

    console.log("This is a test")
    fs.mkdirSync(modelDir);

    fs.writeFileSync(path.join(modelDir, `tab${modelName}.ts`), `
      // Define your model class extending Document
    `);

    fs.writeFileSync(path.join(modelDir, `tab${modelName}.json`), `
      {
        "fields": [
          { "firstName": "string", "LastName": "string","type": "string", "required": true },
        ]
      }
    `);

    console.log(`Model '${modelName}' created successfully!`);
  });

program.parse(process.argv);
