const fs = require('fs').promises;
const path = require('path');
const { DataTypes } = require('sequelize');
const connectToDatabase = require('../utils/database');
const { afterMigrate, beforeMigrate } = require('../hooks')

async function migrate(model, data) {
  const db = await connectToDatabase();
  const modelsDir = path.join(__dirname, '../models');
  const modelFile = `${modelsDir}/${model}/${model}.json`;
  beforeMigrate(
    () => console.log(`Migration started for ${model}`),
    () => console.log(`Migration in progress`),
    () => console.log(`Migration in progress`),
  )
  try {
    const modelData = JSON.parse(await fs.readFile(modelFile, 'utf8'));
    console.log(modelData)
    modelData.name = `tab${modelData.name}`;

    const modelDefinition = {};
    const modelFields = modelData.fields;
    modelFields.forEach(field => {
      modelDefinition[field.name] = {
        type: DataTypes[field.type.toUpperCase()],
        allowNull: !field.mandatory
      };
    });

    const Model = db.define(modelData.name, modelDefinition);

    db.sync().then(() => {
      console.log('Database & tables created!')
      Model.create(data).then(() => {
        console.log('Data created!')
      })
    });
    afterMigrate(
      () => console.log(`Miggration finished for ${modelData.name}`),
      () => console.log(`Miggration finished for ${modelData.name}`),
      () => console.log(`Miggration finished for ${modelData.name}`)
    )
  } catch (error) {
    console.error('Error migrating:', error);
  }
}

module.exports = migrate;
