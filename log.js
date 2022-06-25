const winston = require("winston");

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: process.env.ERR_LOG_PATH,
      level: "error",
    }),
    new winston.transports.File({ filename: process.env.COMBINED_LOG_PATH }),
    new winston.transports.Stream({
      stream: process.stderr,
      level: "debug",
    }),
  ],
});

module.exports = logger;
