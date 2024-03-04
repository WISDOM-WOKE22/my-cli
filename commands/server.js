const express = require("express");
const { afterStart } = require('../hooks')
const { getData } = require("./controller/get-data");

function startServer() {
    const app = express();
    const port = process.env.PORT || 3000;

    app.get('/', (req, res) => {
        res.status(200).json({ message: "Welcome to test cli server" })
    })

    app.get("/data", getData);

    try {
        server = app.listen(port, () => {
            afterStart(
                () => console.log(`Server running on port ${port}`)
            )
        });
    } catch (error) {
        console.error("Error starting server:", error);
    }
}

module.exports = startServer;
