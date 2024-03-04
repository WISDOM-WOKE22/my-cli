#!/usr/bin/env node

const { program } = require("commander");

const createModel = require("./commands/model/create-model");
const startServer = require("./commands/server");
const addData = require("./commands/data/add-data");

program.command("start").action(async () => {
    startServer();
});

program.command("create-model <modelName>").action(async (modelName) => {
    await createModel(modelName);
});

program.command("add-data <modelName>").action(async (modelName) => {
    await addData(modelName);
});

program.parse(process.argv);
