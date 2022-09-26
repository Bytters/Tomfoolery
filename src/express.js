module.exports = async function expr() {
    const path = require('path')
const express = require("express")
const session = require("express-session")
const app = express()

app.use(
    session({
        secret: process.env.SECRET_SESSION,
        resave: false,
        saveUninitialized: true,
        cookie: {
            path: "/",
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
)

require("dotenv").config({
    path: path.join(__dirname, "/backend/dotenv", ".env"),
})

const emotes = require("./backend/routes/emotes")
const loginRouter = require("./backend/routes/login")
const clipes = require("./backend/routes/clipes")
const dashboard = require("./backend/routes/dashboard")
const errorRouter = require("./backend/routes/error")
const halloffame = require("./backend/routes/halloffame")
const isLogged = require("./backend/utils/logged")
const isAdmin = require("./backend/utils/isAdmin")

app.set("view engine", "ejs")
app.set("views", "src/frontend/views")
app.use(express.static(__dirname + "/frontend/public/"))

app.use("/admin/dashboard", dashboard)
app.use("/users/login/", loginRouter)
app.use("/halloffame", halloffame)
app.use("/clipes", clipes)
app.use("/emotes", emotes)
app.use("/error", errorRouter)
app.use("/", (req, res) => {
    isLogged(req, res)
    isAdmin(req, res, req.session.userid)

    res.render("home", {
        user_avatar: req.session.useravatar,
        username: req.session.username,
    })
})

// app.set("trust proxy", 1)

}