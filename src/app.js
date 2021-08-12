import express from "express";
import mongoose from "mongoose";
import { router } from "./config/routes";

import { setGlobalMiddleware } from "./api/middleware/global-middleware";
import { configureJWTStrategy } from "./api/middleware/passport-jwt";

var path = require("path");
var fs = require('fs');

mongoose.Promise = global.Promise;
mongoose
  .connect(
    "mongodb://bigmyuser1:bigmyuser$12@162.214.198.228:27017/store-details?authSource=admin",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB ..."))
  .catch((err) => console.error("Could not connect to MongoDB:‌", err));
const app = express();
setGlobalMiddleware(app);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/store", router);
configureJWTStrategy();

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.message = "Invalid Route";
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.json({
    error: {
      message: error.message,
    },
  });
});

const hostname = "162.214.198.228";
const port = 7423;
var https = require('http');


// var httpsServer = https.createServer({
//   key:fs.readFileSync(path.join(__dirname,'cert','key.key'), 'utf8'),
//   cert:fs.readFileSync(path.join(__dirname,'cert','cert.crt'), 'utf8'),
//   ca: [
//     fs.readFileSync(path.join(__dirname,'cert','ca_bundle.crt'), 'utf8'),
//  ]
// }, app);

app.listen(7420,"0.0.0.0");

