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
    const getEmotes = await db
        .query("SELECT * FROM public.emotes ORDER BY name")
        .then((res) => {
            return res.rows
        })
    res.render("emotes", {
        emotesList: getEmotes,
        user_avatar: req.session.useravatar,
        username: req.session.username,
    })
})

router.post("/vote", async (req, res) => {
    const emote = req.body.emoteVoted
    const userid = req.session.userid
    if (!userid) {
        res.redirect("/error/unauthorized")
        return
    }
    const query = `UPDATE public.emotes SET count = count + 1 WHERE name = '${emote}'`
    const queryRemove = `UPDATE public.emotes SET count = count - 1 WHERE name = '${emote}'`
    const addUser = `INSERT INTO public.usuarios(userid, emote_voted) VALUES (${userid}, '${emote}')`
    const updateVote = `UPDATE public.usuarios SET emote_voted = '${emote}' WHERE userid = ${userid}`
    const userExists = await db
        .query(`SELECT userid FROM public.usuarios WHERE userid = ${userid}`)
        .then((res) => {
            return res.rows[0]
        })
    setTimeout(async () => {
        try {
            if (!userExists) {
                await db.query(addUser)
                await db.query(query)
                res.redirect("/emotes")
            } else {
                res.redirect("/error")
                return
            }
        } catch (err) {
            console.log(err)
        }
    }, 2000)
})

module.exports = router
