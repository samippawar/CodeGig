const express = require("express");
const router = express.Router();
const db = require("../config/database");
const Gig = require("../models/Gig");
const sequelize = require('sequelize');
const Op = sequelize.Op;

router.get("/", (req, res) =>
  Gig.findAll()
    .then((gigs) => {
      console.log(gigs)
      res.render("gigs", {
        gigs,
      })
    })
    .catch((err) => console.log(err))
)

router.get("/add", (req, res) => {
  res.render("add")
})

router.get('/search', (req, res) =>{
  const { term } = req.query

  Gig.findAll({ where: {technologies: {[Op.like]: '%' +term+ '%'}}})
  .then(gigs => res.render('gigs', {gigs}))
  .catch(err => console.log(err))
})

router.post("/add", (req, res) => {
  let { title, technologies, budget, description, contact_email } = req.body
  let errors = [];

  //validate fields
  if (!title) {
    errors.push({ text: "please add a title" });
  }
  if (!technologies) {
    errors.push({ text: "please add technologies" });
  }
  if (!description) {
    errors.push({ text: "please add a description" });
  }
  if (!contact_email) {
    errors.push({ text: "please add a contact email" });
  }

  if (errors.length > 0) {
    res.render("add", {
        errors,
        title,
        description,
        technologies,
        contact_email,
      });
  } else {
    if (!budget) {
      budget = "Unknown"
    } else {
      budget = `₹${budget}`
    }

    technologies = technologies.toLowerCase().replace(/, /g, ",")
    //Inset data into table
    Gig.create({
      title,
      technologies,
      budget,
      description,
      contact_email,
    })
      .then((gig) => res.redirect("/gigs"))
      .catch((err) => console.log(err))
  }
})
module.exports = router
