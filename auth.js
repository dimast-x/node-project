const jwt = require("jsonwebtoken");
const secret = process.env.AUTH_SECRET;

function getToken(req) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  return token;
}

exports.secret = secret;

exports.authenticate = (req, res, next) => {
  const token = getToken(req);
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  const token = getToken(req);
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secret, (err, user) => {
    if (user.role == "admin" || user.role == "superadmin") {
      req.user = user;
      next();
    } else {
      res.sendStatus(403);
    }
  });
};

exports.superAdminMiddleware = (req, res, next) => {
  const token = getToken(req);
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secret, (err, user) => {
    if (err || user.role != "superadmin") return res.sendStatus(403);
    req.user = user;
    next();
  });
};
