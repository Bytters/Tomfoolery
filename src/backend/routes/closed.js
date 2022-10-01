const express = require("express")
const router = express.Router()
const isLogged = require("../utils/logged")

router.get("/", (req, res) => {
    isLogged(req, res)

    res.render("closed", {
        user_avatar: req.session.useravatar,
        username: req.session.username,
    })
})

module.exports = router
