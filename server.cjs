const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

require("dotenv").config();
const express = require("express");
const app = express();
const apiRouter = require("./api/index.cjs");

const port = process.env.PORT || 8080

//middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const path = require("path");
const morgan = require("morgan");
app.use(morgan("dev"));

//Logger
app.use((req, res, next) => {
  console.log("<____Body Logger START____>")
  console.log(req.body)
  console.log("<_____Body Logger END_____>")
  next()
});


//Server
app.use("/api", apiRouter);
app.use("/", express.static(path.join(__dirname, "/dist")))
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"))
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
});