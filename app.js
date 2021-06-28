const express = require('express');
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const _handlebars = require('handlebars');
const path = require("path");
const db = require("./config/database");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

db.authenticate()
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("Error" + err))

const app = express()

//handlebars

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(_handlebars)
  })
)
app.set("view engine", "handlebars")

//set static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended : false}))

 

app.get('/', (req, res) => res.render('index', {layout: 'landing'}));

app.use("/gigs", require("./routes/gigs"))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server started on port ${PORT}`));
