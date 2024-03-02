const express = require('express');
const path = require('path');
const fs = require('fs');
const { afterMigrate, afterStart, beforeMigrate } = require('./hooks')

// Operators mapping for easier handling
const filterOperators = {
  '*': () => true, // Matches any value
  '>': (value, fieldValue) => fieldValue > value,
  '==': (value, fieldValue) => fieldValue === value,
  '>=': (value, fieldValue) => fieldValue >= value,
  '<=': (value, fieldValue) => fieldValue <= value,
};

// ... other code from previous examples (readModelDefinition, selectFields)

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

// Route handler for GET requests to '/:model'
app.get('/:model', async (req, res) => {
  try {
    const modelName = req.params.model; // Get model name from path parameter
    const filters = JSON.parse(req.query.filters || '[]'); // Parse filters from query parameter (default empty array)
    const fields = JSON.parse(req.query.fields || '[]'); // Parse fields from query parameter (default empty array)

    if (!modelName) {
      return res.status(400).json({ message: 'Missing model name in path' });
    }

    const modelPath = path.join(__dirname, 'models', modelName);

    if (!fs.existsSync(modelPath)) {
      return res.status(404).json({ message: `Model '${modelName}' not found` });
    }

    
    const content = fs.readFileSync(`${modelPath}/${modelName}.json`, 'utf-8')
    console.log({modelPath}, content)

    //TODO const modelDefinition = readModelDefinition(modelPath);
    const data = [ // Replace with your logic to retrieve data based on the model
      { name: 'John', email: 'john@example.com', age: 30 },
      { name: 'Jane', email: 'jane@example.com', age: 25 },
    ];

    // Apply filters if provided
    const filteredData = filters.length > 0 ? data.filter(item => {
      return filters.every(filter => {
        const { field, operator, value } = filter;
        const filterFn = filterOperators[operator]; // Use operator mapping for cleaner logic

        // Handle "*" (get all data) case
        if (operator === '*') {
          return true;
        }

        // Validate operator existence
        if (!filterFn) {
          throw new Error(`Unsupported operator: ${operator}`);
        }

        return filterFn(value, item[field]); // Apply filter based on operator
      });
    }) : data; // Return all data if no filters

    // const selectedData = selectFields(filteredData, fields);

    // res.json(selectedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
    afterStart(
        () => console.log(`Server listening on port ${port}`),
        () => console.log('Hello')
    )
    afterStart(
        () => console.log('My helper')
    )
});