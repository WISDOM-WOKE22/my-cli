const express = require("express");
const { getData } = require("./controller/get-data");

function startServer() {
    const app = express();
    const port = process.env.PORT || 3000;

    app.get("/", getData);

    try {
        server = app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
    }
}

module.exports = startServer;
