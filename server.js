const express = require("express");
var request = require("request");
const userRouter = require("./routes/users");
const itemsRouter = require("./routes/items");

const logger = require("./log.js");
const db = require("./db.js");
const app = express();

async function checkDBConnection() {
  try {
    await db.authenticate();
    logger.info("Connection has been established successfully.");
  } catch (error) {
    logger.error("Unable to connect to the database: ", error);
  }
}

checkDBConnection();
app.use(express.json());

app.use("/users", userRouter);
app.use("/items", itemsRouter);

app.get("/bitcoin", function (req, res, next) {
  request({
    uri: "https://api.coindesk.com/v1/bpi/currentprice.json",
    method: "GET",
  }).pipe(res);
});

var port = process.env.PORT;
if (!port) {
  port = 3000;
}
app.listen(port);
logger.info(`Server started listening on port ${port}`);
