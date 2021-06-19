// First we load in all of the packages we need for the server...
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const axios = require("axios");
const debug = require("debug")("personalapp:server");
const http = require("http");
// const nodemon = require("nodemon");

// Now we create the server
const app = express();

// Here we specify that we will be using EJS as our view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Here we process the requests so they are easy to handle
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Here we specify that static files will be in the public folder
app.use(express.static(path.join(__dirname, "public")));

// Here we enable session handling ..
app.use(
  session({
    secret: "zzbbya789fds89snana789sdfa",
    resave: false,
    saveUninitialized: false
  })
);

app.use(function(req, res, next) {

  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", function(req, res, next) {
  res.render("index");
});

app.get("/application", function(req, res, next) {
  res.render("application");
});

app.get("/api", async function(req, res, next) {

    try {
      const url = "https://data.cityofchicago.org/resource/ydr8-5enu.json"
      const result = await axios.get(url)
      // res.json(result.data)
      res.locals.data = result.data;
      res.render("projects");
    } catch(error){
      next(error)
    }
});

app.post("/submitApplication", function(req, res, next) {

  res.locals.firstname = req.body.firstname;
  res.locals.lastname = req.body.lastname;
  res.locals.birthday = req.body.birthday;
  res.locals.email = req.body.email;
  res.locals.mobile = req.body.mobile;
  res.locals.grade = req.body.grade;
  res.locals.country = req.body.country;
  res.locals.state = req.body.state;
  res.locals.city = req.body.city;
  res.locals.reason = req.body.reason;
  res.locals.goal = req.body.goal;

  const year = new Date().getFullYear();
  res.locals.age = year - parseInt(req.body.birthday.split("-")[0]);

  res.render("profile");
});

//Here we set the port to use
const port = "5000";
app.set("port", port);

// and now we startup the server listening on that port
const server = http.createServer(app);

server.listen(port, function() {
  console.log("Server started: http://localhost:" + port + "/ ...");
});

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

server.on("error", onError);
server.on("listening", onListening);

module.exports = app;
