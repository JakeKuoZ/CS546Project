const express = require("express");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
const session = require("express-session");

const public = express.static(__dirname + "/public")
const uploads = express.static(__dirname + "/uploads")
const app = express()


app.use("/public", public)
app.use("/uploads", uploads)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const handlerbarInstance = exphbs.create({
    defaultLayout: "main"
})

app.engine('handlebars', handlerbarInstance.engine)
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(async (req, res, next) => {
  const timeStamp = new Date().toUTCString();
  const method = req.method;
  const route = req.originalUrl;

  if (!req.session.user) {
    const authenticated = "(non-authenticated)";
    console.log(`[${timeStamp}] ${method} ${route} ${authenticated}`);
  } else {
    const authenticated = "(authenticated)";
    console.log(`[${timeStamp}] ${method} ${route} ${authenticated}`);
  }
  next();
});
const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    console.log(req.originalUrl)
    if(req.body && req.body._method) {
        req.method = req.body._method
        delete req.body._method
    }
    
    if(req.method === "POST" && req.originalUrl.startsWith("/service/alter-service")) {
        req.method = "PUT"
    }

    if(req.method === "POST" && req.originalUrl === "/user/myprofile") {
        req.method = "PUT"
    }

    next()
}

app.use(rewriteUnsupportedBrowserMethods)
configRoutes(app)

app.listen(3000, () => {
  console.log("Your server is running at http://localhost:3000");
});
