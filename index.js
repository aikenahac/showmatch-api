const express = require("express");
const BodyParser = require("body-parser");

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const dotenv = require("dotenv");
dotenv.config();

const user = require("./routes/user"); // a fine addition to our collection
const movies = require("./routes/movies");
const InitiateMongoServer = require("./config/db");

const app = express();

const http = require('http').createServer(app)
const socketio = require('socket.io')(http)

// PORT
const PORT = process.env.PORT || 8081;
const PORT2 = process.env.PORT2 || 8082;

const DB_NAME = "prod";
const CONNECTION_URL = process.env.MONGOURI;

let db, coll;

// Initiate Mongo Servers
InitiateMongoServer().then(r => console.log("Mongo initiated"));

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

socketio.on("connection", (userSocket) => {
	userSocket.on("send_message", (data) => {
		userSocket.broadcast.emit("receive_message", data)
	})
})

http.listen(PORT2);

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

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

app.get("/movies", (request, response) => {
	coll.find({}).toArray((error, result) => {
		if (error) {
			return response.status(500).send(error);
		}

		response.send(result);
	})
})
