const express = require("express")
const router = express.Router()
const db = require("../database/database")
const isLogged = require("../utils/logged")
const isAdmin = require("../utils/isAdmin")

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.get("/", async (req, res, next) => {
    isLogged(req, res)
    isAdmin(req, res, req.session.userid)

    const userid = req.session.userid
    const getEmotes = (
        await db.query("SELECT * FROM public.emotes ORDER BY name")
    ).rows
    const getVoted = await db.query("SELECT * FROM public.usuarios")

    const body = {
        emotesList: getEmotes,
        user_avatar: req.session.useravatar,
        username: req.session.username,
        userid: req.session.userid,
    }

    res.render("emotes", body)
})

router.post("/vote", async (req, res) => {
    const emote = req.body.emoteVoted
    const userid = req.session.userid

    if (!userid) {
        res.redirect("/error/unauthorized")
        return
    }

    const action = {
        update: `UPDATE public.emotes SET count = count + 1 WHERE name = '${emote}'`,
        add: `INSERT INTO public.usuarios(userid, emote_voted) VALUES (${userid}, '${emote}')`,
    }

    const userExists = (
        await db.query(
            `SELECT userid FROM public.usuarios WHERE userid = ${userid}`
        )
    ).rows[0]

    if (userExists) {
        res.redirect("/error")
        return
    } else {
        await db.query(action.update)
        await db.query(action.add)
        res.redirect("/error/voted")
    }
})

module.exports = router
