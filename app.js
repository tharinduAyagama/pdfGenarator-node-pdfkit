const express = require("express");
const bodyParser = require("body-parser");
const exhbs = require("express-handlebars");
const path = require("path");
const pdfDoc = require("pdfkit");
const pdf = require("pdf-creator-node");
const fs = require("fs");

var html = fs.readFileSync("template.html", "utf8");

var options = {
  format: "A3",
  orientation: "portrait",
  border: "10mm",
  header: {
    height: "45mm",
    contents: '<div style="text-align: center;">Report</div>',
  },
  footer: {
    height: "28mm",
    contents: {
      first: "Cover page",
      2: "Second page", // Any page number is working. 1-based index
      default:
        '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
      last: "Last Page",
    },
  },
};
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
  // doc.pipe(fs.createWriteStream("repot.pdf"));
  // doc.fontSize(25).text(req.body.content);
  // doc.end();
  var document = {
    html: html,
    data: {
      desc: req.body.content,
    },
    path: "./output.pdf",
  };
  pdf
    .create(document, options)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });
  // res.render("contact", { msg: "PDF has been created..." });
});

app.listen(3000, () => {
  console.log("server started ...");
});
