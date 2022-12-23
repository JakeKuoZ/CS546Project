const express = require("express");
const router = express.Router();
const xss = require("xss");
const data = require("../data");
const uploader = require("../utils/uploader");
const fs = require("fs");
const users = data.users;
const validation = require("../utils/userValidation");
const userData = data.authData;
const path = require("path");

const mongoCollections = require("./../config/mongoCollections");
const service = mongoCollections.services;
const reviews = mongoCollections.reviews;
const user = mongoCollections.users;

router.route("/").get(async (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, "../static", "homepage.html"));
  } else {
    res.sendFile(path.join(__dirname, "../static", "homepage.html"));
  }
});

router
  .route("/register")
  .get(async (req, res) => {
    if (req.session.user) {
      res.redirect("/protected");
    } else {
      res.render("signup", {
        layout: "mainReg",
        title: "Register",
        hidden: "hidden",
        errir_information: 1,
      });
    }
  })
  .post(async (req, res) => {
    let postData = req.body;
    try {
      validation.checkUsername(postData.usernameInput);
      validation.checkEmail(postData.emailInput);
      validation.checkPassword(postData.passwordInput);
      validation.checkPassword(postData.confirmPassword);
    } catch (e) {
      res.status(400).render("signup", {
        layout: "mainReg",
        error_information: e,
        username: postData.usernameInput,
        email: postData.emailInput,
      });
      return;
    }

    try {
      const username = validation.checkUsername(postData.usernameInput);
      const email = validation.checkEmail(postData.emailInput);
      const password = validation.checkPassword(postData.passwordInput);
      const confirm = validation.checkPassword(postData.confirmPassword);
      const createInfo = await userData.createUser(
        username,
        email,
        password,
        confirm
      );
      if (!createInfo.insertedUser) {
        res.status(500).render("userRegister", {layout: "mainReg",
          error_information: "Internal Server Error",
        });
        return;
      }
      res.redirect("/");
    } catch (e) {
      res.status(400).render("signup", {layout: "mainReg",
        error_information: e,
      });
      return;
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    res.render("login", { layout: "mainReg",title: "Login"});
  })
  .post(async (req, res) => {
    let postData = req.body;
    try {
      if (postData.emailInput === "" || postData.passwordInput === "") {
        throw "Email and password are required";
      }
      validation.checkEmail(postData.emailInput);
      validation.checkPassword(postData.passwordInput);
    } catch (e) {
      res.status(400).render("login", { layout: "mainReg",
        error_information: e,
      });
      return;
    }

    try {
      const email = validation.checkEmail(postData.emailInput);
      const password = validation.checkPassword(postData.passwordInput);
      const loginInfo = await userData.checkUser(email, password);
      if (!loginInfo.authenticatedUser) {
        res.status(500).render("login", {layout: "mainReg",
          error_information: "Internal Server Error",
        });
        return;
      }
      req.session.user = {
        userId: loginInfo.userId,
        username: loginInfo.username,
        firstName: loginInfo.firstName,
        email: loginInfo.email,
      };
      req.session.cookie = { ...req.session.cookie, name: "AuthCookie" };
      res.redirect("/");
    } catch (e) {
      res.status(400).render("login", {layout: "mainReg",
        error_information: e,
      });
      return;
    }
  });

router.route("/protected").get(async (req, res) => {
  console.log(req.session.user)
  if (req.session.user) {
    const currentDate = new Date();
    var userID = req.session.user.userId
    const serviceCollection = await service();
    const userServices = await serviceCollection.find({userId: userID}).toArray();
    res.render("private", {
      content: { email: req.session.user.email, date: currentDate},service: userServices
    });
  } else {
    res.render("forbiddenAccess", {});
  }
});

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  res.render("logout", { layout: "mainReg",information: "You have been logged out" });
});

module.exports = router;
