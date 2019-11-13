const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

//Employee Form
router.get("/", (req, res) => {
  res.render("employee/add", {
    viewTitle: "Insert Employee"
  });
});

//Create Employee
router.post("/", async (req, res) => {
  const employee = new Employee({
    fullname: req.body.fullname,
    email: req.body.email,
    mobile: req.body.mobile,
    city: req.body.city
  });

  try {
    const savedEmployee = await employee.save();
    res.redirect("employee/list");
  } catch (err) {
    res.redirect("/employee");
  }
});

//List of employees
router.get("/list", async (req, res) => {
  try {
    const employees = await Employee.find().exec();
    res.render("employee/list", {
      employees: employees
    });
  } catch (err) {
    console.log(err);
  }
});

//Get edit form
router.get("/edit/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    res.render("employee/edit", {
      viewTitle: "Update Employee",
      employee: employee
    });
  } catch (err) {
    res.redirect("/employee");
  }
});

//Update Employee
router.put("/:id", async (req, res) => {
  let employee;

  try {
    employee = await Employee.findById(req.params.id);
    employee.fullname = req.body.fullname;
    employee.email = req.body.email;
    employee.mobile = req.body.mobile;
    employee.city = req.body.city;

    const updatedEmployee = await employee.save();
    res.redirect("/employee/list");
  } catch (err) {
    res.redirect("/");
  }
});

//Get delete form
router.get("/delete/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    res.render("employee/delete", {
      viewTitle: "Remove Employee",
      employee: employee
    });
  } catch (err) {
    res.redirect("/employee");
  }
});

//Delete employee
router.delete("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    await employee.remove();
    res.redirect("/employee/list");
  } catch (err) {
    res.redirect("/");
  }
});

module.exports = router;
