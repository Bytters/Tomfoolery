const express = require("express")
const router = express.Router()
const db = require("../database/database")

const isLogged = require("../utils/logged")
const isAdmin = require("../utils/isAdmin")

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.get("/", async (req, res) => {
    isLogged(req, res)
    isAdmin(req, res, req.session.userid)
    res.redirect("closed")
})

module.exports = router
