const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

//* User model
const User = require("../models/User");

//* Login Page
router.get("/login", (req, res) => {
  res.render("login");
});

//* Register Page
router.get("/register", (req, res) => {
  res.render("register");
});

//* Register Handle
router.post("/register", async (req, res) => {
  //* Destructuring
  const { name, email, password, password2 } = req.body;

  let errors = [];
  //* Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  //* Check passwords match
  if (password !== password2) errors.push({ msg: "Passwords do not match" });

  //* Checl pass length
  if (password.length < 6)
    errors.push({ msg: "Password should be at least 6 characters" });

  //* Check email exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) errors.push({ msg: "Email already exists" });

  if (errors.length > 0) {
    res.render("register", { errors, name, email });
  } else {
    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create new User
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });

    try {
      const savedUser = await user.save();
      req.flash("success_msg", "Registration done!");
      res.redirect("/users/login");
    } catch (err) {
      res.status(400).send(err);
    }
  }
});

//* Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

//* Logout Handle
router.delete("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
