const express = require("express")
const session = require("express-session")
const app = express()
const http = require("http")
const server = http.createServer(app)
const path = require("path")
const port = process.env.PORT || 3000

require("dotenv").config({
    path: path.join(__dirname, "/backend/dotenv", ".env"),
})

const isLogged = require("./backend/utils/logged")
const sevenTV = require("./backend/utils/7tv")
const isAdmin = require("./backend/utils/isAdmin")
const get = require("./routers")
// sevenTV()

app.set("trust proxy", 1)
app.use(
    session({
        secret: process.env.SECRET_SESSION,
        resave: false,
        saveUninitialized: true
    })
)

app.set("view engine", "ejs")
app.set("views", "src/frontend/views")
app.use(express.static(__dirname + "/frontend/public/"))

app.use("/admin/dashboard", get.dashboard)
app.use("/users/login/", get.login)
app.use("/halloffame", get.halloffame)
app.use("/clipes", get.clipes)
app.use("/emotes", get.emotes)
app.use("/error", get.error)
app.use("/home", get.home)
app.use("/", (req, res) => {
    isLogged(req, res)
    isAdmin(req, res, req.session.userid)

    res.render("index.ejs", {
        user_avatar: req.session.useravatar,
        username: req.session.username,
    })
})

server.listen(port, () => {
    console.log("Connected on port: " + port)
})
