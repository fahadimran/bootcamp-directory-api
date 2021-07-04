const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const fileupload = require("express-fileupload");
const auth = require("./routes/auth");
const cookieParser = require("cookie-parser");
const connectToMongoDB = require("./config/db");
const errorHandler = require("./middleware/error");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
require("colors");

// import routes
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

// load environment variables
dotenv.config({ path: "./config/config.env" });

// connect to mongoDB
connectToMongoDB();

// create express server
const app = express();

// morgan logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// body parser middleware
app.use(express.json());

// cookie parser
app.use(cookieParser());

// file upload
app.use(fileupload());

// sanitize data
app.use(mongoSanitize());

// set security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// prevent XSS attacks
app.use(xss());

// limit requests to 100 per 10 min
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// prevent http param pollution
app.use(hpp());

// enable CORS
app.use(cors());

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

// error handler middleware
app.use(errorHandler);

// configure port
const PORT = process.env.PORT || 5000;

// listen on specified port
const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}...`
      .yellow.inverse
  )
);

// handle unhandledRejections
process.on("unhandledRejection", (err, promise) => {
  // log error
  console.log(`Error: ${err.message}`.red);

  // close and exit server
  server.close(() => process.exit(1));
});
