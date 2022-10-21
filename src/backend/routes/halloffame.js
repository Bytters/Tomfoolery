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

    const month = req.query.meses || "setembro"
    let months = []
    let names = []

    const search = `SELECT * FROM public.halloffame WHERE mes = '${month}'`
    const hofDB = "SELECT * FROM public.halloffame"

    const getWinners = await db.query(search)
    const add = await db.query(hofDB)

    add.rows.forEach((e) => {
        months.push(e.mes)
    })

    getWinners.rows.forEach((emoteName) => {
        names.push(emoteName.nome)
    })

    const renderObj = {
        mes: months,
        clipe: getWinners.rows[0].clipe,
        emote: getWinners.rows[0].emote,
        monthSelected: req.query.meses,
        username: req.session.username,
        user_avatar: req.session.useravatar,
        name: getWinners.rows[0].nome,
    }

    res.render("halloffames.ejs", renderObj)
})

module.exports = router
