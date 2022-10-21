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
        const userid = req.session.userid
    const getVoted = await db.query("SELECT * FROM public.usuarios")
    const voted = !userid ? undefined : await db.query(`SELECT userid FROM public.usuarios WHERE userid = ${userid}`).then((res) => {return res.rows[0]})
   console.log(voted, userid)
    res.render("emotes", {
        emotesList: getEmotes,
        user_avatar: req.session.useravatar,
        username: req.session.username,
        userid: req.session.userid,
        voted: voted
    })
})

router.post("/vote", async (req, res) => {
    const emote = req.body.emoteVoted
    const userid = req.session.userid

    const action = {
        update: `UPDATE public.emotes SET count = count + 1 WHERE name = '${emote}'`,
        add: `INSERT INTO public.usuarios(userid, emote_voted) VALUES (${userid}, '${emote}')`,
    }

    if (!userid) {
        res.redirect("/error/unauthorized")
        return
    }

    const userExists = await db
        .query(`SELECT userid FROM public.usuarios WHERE userid = ${userid}`)
        .then((res) => {
            return res.rows[0]
        })

    setTimeout(async () => {
        try {
            if (!userExists) {
                await db.query(action.add)
                await db.query(action.update)
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
