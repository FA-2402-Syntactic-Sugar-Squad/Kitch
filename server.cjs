const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const apiRouter = require("./api/index.cjs");

const port = process.env.PORT || 3000

//middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const path = require("path");
const morgan = require("morgan");
app.use(morgan("dev"));

// Middleware to set Cache-Control header to prevent caching
const noCacheMiddleware = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
};

// Apply the middleware globally to all API routes
app.use('/api', noCacheMiddleware);

//Logger
app.use((req, res, next) => {
  console.log("<____Body Logger START____>")
  console.log(req.body)
  console.log("<_____Body Logger END_____>")
  next()
});


//Server
app.use("/api", apiRouter);
app.use("/auth", require("./auth/auth.cjs"));
app.use("/", express.static(path.join(__dirname, "/dist")))
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"))
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send(err.message || "Internal server error.");
});

// Default to 404 if no other route matched
app.use((req, res) => {
  res.status(404).send("Path not found.");
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
});