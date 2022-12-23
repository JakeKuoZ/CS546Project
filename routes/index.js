const servicesRoutes = require("./serviceRoutes");
const reviewRoutes = require("./reviewRoutes");
const authRoutes = require("./authRoutes");
const searchRoutes = require("./searchRoutes");
const myprofile = require("./userRoutes");
const path = require("path");

const configRoutes = (app) => {
  app.use("/service", servicesRoutes);
  app.use("/reviews", reviewRoutes);
  app.use("/search", searchRoutes);
  app.use("/user", myprofile)
  app.use("/", authRoutes);

  app.use("*", (req, res) => {
    res.sendFile(path.resolve("static/homepage.html"));
  });
};

module.exports = configRoutes;
