const express = require("express");
const bodyParser = require("body-parser");
const exhbs = require("express-handlebars");
const path = require("path");
const pdfDoc = require("pdfkit");
const fs = require("fs");

const doc = new pdfDoc();

const app = express();

app.engine("handlebars", exhbs());
app.set("view engine", "handlebars");

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("contact");
});

app.post("/create", (req, res) => {
  doc.pipe(fs.createWriteStream("repot.pdf"));
  doc.fontSize(25).text(req.body.content);
  doc.end();
  res.render("contact", { msg: "PDF has been created..." });
});

app.listen(3000, () => {
  console.log("server started ...");
});
