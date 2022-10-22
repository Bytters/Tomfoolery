const express = require("express")
const router = express.Router()
const isLogged = require("../utils/logged")
const isAdmin = require("../utils/isAdmin")

router.get("/", (req, res) => {
    isLogged(req, res)
    isAdmin(req, res, req.session.userid)

    res.render("error", {
        user_avatar: req.session.useravatar,
        username: req.session.username,
        image: "https://cdn.7tv.app/emote/630660200e929d2fde44db5b/3x",
        message: "Você já votou",
    })
})

router.get("/unauthorized", (req, res) => {
    isLogged(req, res)
    isAdmin(req, res, req.session.userid)

    res.render("error", {
        user_avatar: req.session.useravatar,
        username: req.session.username,
        image: "https://cdn.betterttv.net/emote/566c9fc265dbbdab32ec053b/3x",
        message: "Você não está logado",
    })
})

router.get("/forbidden", (req, res) => {
    isLogged(req, res)
    isAdmin(req, res, req.session.userid)

    res.render("error", {
        user_avatar: req.session.useravatar,
        username: req.session.username,
        image: "https://cdn.betterttv.net/emote/566c9fc265dbbdab32ec053b/3x",
        message: "Você não tem permissão",
    })
})

router.get("/voted", (req, res) => {
    isLogged(req, res)
    isAdmin(req, res, req.session.userid)

    res.render("error", {
        user_avatar: req.session.useravatar,
        username: req.session.username,
        image: "https://cdn.7tv.app/emote/60b5ae6cfc5978e646cffd39/4x.webp",
        message: "Voto registrado!",
    })
})
module.exports = router
