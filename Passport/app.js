if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");

const app = express();

//* Passport Config
require("./config/passport")(passport);

//* DB Config
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

//* EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//* Express body parser
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());

//* Express session
app.use(session({ secret: "secret", resave: true, saveUninitialized: true }));

//* Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//* Connect flash
app.use(flash());

//* Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//* Method Override
app.use(methodOverride("_method"));

//* Routes
app.use("/", require("./routes/index.js"));
app.use("/users", require("./routes/users.js"));

//* Connect server
app.listen(process.env.PORT || 3000, () => console.log("Server running"));
