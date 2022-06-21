const express = require("express");
var request = require("request");
const winston = require("winston");
var morgan = require("morgan");
const userRouter = require("./routes/users");
const itemsRouter = require("./routes/items");
const db = require("./db.js");
const app = express();

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: "main server" },
  transports: [
    new winston.transports.File({
      filename: process.env.ERR_LOG_PATH,
      level: "error",
    }),
    new winston.transports.File({ filename: process.env.COMBINED_LOG_PATH }),
  ],
});

async function checkDBConnection() {
  try {
    await db.authenticate();
    logger.info("Connection has been established successfully.");
  } catch (error) {
    logger.error("Unable to connect to the database: ", error);
  }
}

checkDBConnection();
app.use(morgan("combined"));
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
