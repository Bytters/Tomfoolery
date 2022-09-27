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

    const month = req.query.meses || "agosto"
    let hofArr = []

    const searchMonth = `SELECT * FROM public.halloffame WHERE mes = '${month}'`
    const hofDB = "SELECT * FROM public.halloffame"

    const getWinners = await db.query(searchMonth).then((res) => {
        return res.rows[0]
    })

    const addHof = await db.query(hofDB).then((res) => {
        return res.rows
    })

    addHof.forEach((e) => {
        hofArr.push(e.mes)
    })

    res.render("halloffames.ejs", {
        mes: hofArr,
        clipe: getWinners.clipe,
        emote: getWinners.emote,
        monthSelected: req.query.meses,
        username: req.session.username,
        user_avatar: req.session.useravatar,
    })
})

module.exports = router
