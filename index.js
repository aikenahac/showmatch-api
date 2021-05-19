const express = require("express");
const BodyParser = require("body-parser");

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const dotenv = require("dotenv");
dotenv.config();

const user = require("./routes/user"); // a fine addition to our collection
const InitiateMongoServer = require("./config/db");

// Initiate Mongo Server
InitiateMongoServer();

const app = express();

// PORT
const PORT = process.env.PORT;

const DB_NAME = "prod";
const CONNECTION_URL = process.env.MONGOURI;

let db, coll;

// Middleware
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.json({
		message: "ShowMatch API Working"
	});
});

/**
 * Router Middleware
 * Router - /user/*
 * Method - *
 */
app.use("/user", user);

app.listen(PORT, (req, res) => {
	// This is not a good solution, mongoose should be the only one for REST, but I was on a time crunch. Tough luck
	MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
		if (error) {
			throw error;
		}

		db = client.db("prod");
		coll = db.collection("movies_and_shows");
		console.log(`Connected to ${DB_NAME}!`)
	});
	console.log(`Server Started at PORT ${PORT}`);
});

app.get("/movies", (request, response) => {
	coll.find({}).toArray((error, result) => {
		if (error) {
			return response.status(500).send(error);
		}

		response.send(result);
	})
})