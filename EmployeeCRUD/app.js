if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");

const app = express();
app.set("views", path.join(__dirname, "/views/"));
app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    defaultLayout: "mainLayout",
    layoutsDir: __dirname + "/views/layouts/"
  })
);
app.set("view engine", "hbs");

//**DB Connection
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

//**Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

//** Import routes
const employeeRoute = require("./routes/employee");

// Route Middlewares
app.use("/employee", employeeRoute);

//**Running Server
app.listen(process.env.PORT || 3000, () => console.log("Server running"));
