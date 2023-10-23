const express = require("express"); // import express dependency
const session = require("express-session"); // import express-session
const path = require("path"); // import built-in path module, which provides utilities for working with file and directory paths
const hbs = exphbs.create({ helpers }); // creating an instance of an express handlebars engine
const exphbs = require("express-handlebars"); // Node.js module
const helpers = require("./utils/helpers"); // import helpers
const sequelize = require("./config/databaseConnection"); // import sequelize connection, modularizing routes that were separated into different files for better organization and maintainability; library for referring to the database
const routes = require("./controllers"); // import controllers
const SequelizeStore = require("connect-session-sequelize")(session.Store); // connects sequelize to sessions
const app = express(); // set up express app
const PORT = process.env.PORT || 3007; // specify the port express will run on
app.use(routes); // uses routes defined in the `routes` router for specific paths

// session creation
const sess = {
  secret: "This is a secret",
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// set handlebars as the default template engine
app.engine("handlebars", hbs.engine); // set Handlebars view engine to render dynamic content
app.set("view engine", "handlebars"); // set `view engine` to `handlebars`
app.use(session(sess)); // incorporating session management into Express.js, used to persist user data across multiple requests; the session middleware helps manage this data and associate it with a particular user session
app.use(express.static(path.join(__dirname, "public"))); // serve static files and joins the segments together
app.use(express.json()); // parses incoming JSON requests and populates the `req.body` object
app.use(express.urlencoded({ extended: false })); // parses incoming URL-encoded form data and populate the `req.body` object; representing special characters in the URL by replacing them with a % and 2 hexadecimal digits

// sync models to database, then turn on server
// force determines whether to drop the existing tables and recreate them when syncing the sequelize modules with the database (false = no dropping database)
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () =>
    console.log(`Now listening on: http://localhost:${PORT}`)
  );
});
