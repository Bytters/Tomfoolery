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

const emotes = require("./backend/routes/emotes")
const loginRouter = require("./backend/routes/login")
const clipes = require("./backend/routes/clipes")
const dashboard = require("./backend/routes/dashboard")
const errorRouter = require("./backend/routes/error")
const halloffame = require("./backend/routes/halloffame")
const home = require("./backend/routes/home")
const isLogged = require("./backend/utils/logged")
const isAdmin = require("./backend/utils/isAdmin")
const sevenTV = require("./backend/utils/7tv")

app.set("trust proxy", 1)
sevenTV()
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

app.set("view engine", "ejs")
app.set("views", "src/frontend/views")
app.use(express.static(__dirname + "/frontend/public/"))

app.use("/admin/dashboard", dashboard)
app.use("/users/login/", loginRouter)
app.use("/halloffame", halloffame)
app.use("/clipes", clipes)
app.use("/emotes", emotes)
app.use("/error", errorRouter)
app.use("/home", home)
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
