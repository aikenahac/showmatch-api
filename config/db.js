const mongoose = require("mongoose");

// Replace this with your MONGOURI.
const {
    MONGOURI
} = require("../config.json");

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true
    });
    console.log("Connected to Database!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;