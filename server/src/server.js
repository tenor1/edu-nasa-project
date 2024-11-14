const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;
const MONGO_URL = `mongodb+srv://tenor:Tenor%23483@cluster0.cmtku.mongodb.net/nasa?retryWrites=true&w=majority&appName=Cluster0`;

const server = http.createServer(app);
// mongoose.connection.on("open", () => console.log("MongoDB connection ready!"));
mongoose.connection.once("open", () => console.log("MongoDB connection ready!"));
mongoose.connection.on("error", (err) => console.log(err));

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();
  server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
}

startServer();