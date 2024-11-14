const mongoose = require('mongoose');

const MONGO_URL = `mongodb+srv://tenor:Tenor%23483@cluster0.cmtku.mongodb.net/nasa?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connection.once("open", () => console.log("MongoDB connection ready!"));
mongoose.connection.on("error", (err) => console.log(err));

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect
}