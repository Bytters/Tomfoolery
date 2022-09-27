const express = require("express")
const router = express.Router()
const axios = require("axios")
const db = require("../database/database")
const isAdmin = require("../utils/isAdmin")

const isLogged = require("../utils/logged")

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.get("/", async (req, res) => {
    isLogged(req, res)
    isAdmin(req, res, req.session.userid)

    res.render("home.ejs", {
        user_avatar: req.session.useravatar,
        username: req.session.username,
    })
})

module.exports = router
