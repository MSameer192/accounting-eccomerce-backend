const session = require("express-session");

module.exports = function (app) {
  const sess = {
    secret: "some-secret",
    resave: true,
    saveUninitialized: true,
    cookie: {},
  };

  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
    sess.cookie.secure = true;
    sess.cookie.sameSite = "none";
    sess.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // One Week
  }
  app.use(session(sess));
};
