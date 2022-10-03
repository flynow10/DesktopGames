const http = require("http");
const express = require("express");
const app = express(http.createServer());

app.use(express.static("./"));

app.listen(3000, () => {
    console.log("Started server on port 3000");
});
