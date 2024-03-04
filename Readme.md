Backend Application README
==========================

Overview
--------

This backend application is designed to showcase various features including a hooks system, CLI for model creation, model structure and validation, and API endpoints. It's built using Node.js and utilizes TypeScript for typing and Express.js for handling API requests.

Features
--------

1.  Hooks System: Executes functions at specific events.
2.  CLI for Model Creation: Command-Line Interface tool to create new models.
3.  Model Structure and Validation: Enforces naming conventions and validations for models.
4.  API Endpoint: Provides endpoints to retrieve data based on model specifications.

Installation
------------

1. Clone this repository to your local machine:

bash
Copy code
git clone https://github.com/your/repository.git

2.  Navigate into the project directory:

    bashCopy code

    `cd project-directory`

3.  Install dependencies:

    bashCopy code

    `sudo npm install -g`

Usage
-----

### CLI Commands

-   Create Model: Use the following command to create a new model:

    bashCopy code

    `test-cli create-model <modelName>`

    Replace `<modelName>` with the desired name of the model.

-   Start Server: Use the following command to start the server:

    bashCopy code

    `test-cli start`

-   Add Data to Model Table: Use the following command to add data to a model table. Migration occurs during this process:

    bashCopy code

    `test-cli add-data <modelName>`

    Replace `<modelName>` with the name of the model to which you want to add data.

### Hooks System

The application contains hooks that execute functions at specific events. These hooks include:

-   `afterStart`: Runs after the application starts.
-   `beforeMigrate`: Runs before database migration.
-   `afterMigrate`: Runs after database migration.

### API Endpoint

The application provides an API endpoint to retrieve data based on a model name. Use appropriate parameters to specify the model, fields, and filters.

Endpoint URL: http://localhost:3000/data

Parameters:

modelName: Name of the model.
fields: Array specifying fields to retrieve (e.g., ["name", "age", "email"] for specific fields).
filters: Object specifying filter conditions (e.g., {"email":["==","wisdomwoke@gmail.com"]}) and the vaue.

exmaple:

http://localhost:3000/data?modelName=test&fields=["name","age","email"]&filters={"email":["==","wisdomwoke@gmail.com"]}


Here I'm quering the test table to return data of a user whoe's email is "wisdomwoke@gmail.com and also asking 