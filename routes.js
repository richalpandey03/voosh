const express = require("express");
const apiRouter = express.Router();
const userRoutes = require("./modules/userprofile/userRoutes")
module.exports = () =>
	apiRouter
        .use("/api", userRoutes())
		.get("/healthcheck", (req, res) => {
			res.send("The server is up and running");
		});