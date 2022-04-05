const fs = require("fs");
const express = require("express");
const { format } = require("date-fns");
const { body, validationResult } = require("express-validator");
const router = express.Router();

const students = JSON.parse(fs.readFileSync("students.json"))

router.get("/", (req, res) => {
  const handleDeleteClick = (id) => {
    console.log(id);
  }
  res.render("students", { students, format: format, onDelClick: handleDeleteClick })
})

router
  .route("/add")
  .get((req, res) => {
    res.render("add-student")
  })
  .post(
    body("name").isLength({min: 3, max: 20}),
    body("lastname").isLength({min: 3, max: 20}),
    body("mark").isNumeric({min: 0, max: 100}),

    (req, res) => {
      const errors = validationResult(req);
      console.log(`hello`);
      if (!errors.isEmpty()) {
        return res.send("Invalid input(s)")
      }
      const { name, lastname: lastName, mark } = req.body;

      students.push({
        id: Math.floor(Math.random() * 1000),
        name,
        lastName,
        mark: +mark,
        markedDate: new Date().toISOString()
      });

      fs.writeFileSync("students.json", JSON.stringify(students))
      res.redirect("/students")
    }
  )

router
  .route("/:id")
  .get((req, res) => {
    const studentId = req.params.id;
    const student = students.find(student => student.id == studentId);
    res.render("edit-student", {...student})
  })
  .post(
    body("name").isLength({min: 3, max: 20}),
    body("lastname").isLength({min: 3, max: 20}),
    body("mark").isNumeric({min: 0, max: 100}),
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.send("Invalid input(s)")
      }
      const { name, lastname: lastName, mark } = req.body;
      const id = req.params.id;

      const changedStudentIndex = students.findIndex(student => student.id == id);
      students.splice(changedStudentIndex, 1, {
        id,
        name,
        lastName,
        mark,
        markedDate: new Date().toISOString()
      })

      fs.writeFileSync("students.json", JSON.stringify(students))

      res.redirect(303, "/students");
    }
  )
  .delete((req, res) => {
    res.send("delete student")
  })

module.exports = router;