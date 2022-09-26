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

    const getClipesLinks = await db
    .query("SELECT * FROM public.clipes")
    .then((res) => {
        let arr = []
       for(let i = 0; i < res.rows.length; i++) {
         arr.push(res.rows[i].clip)
       }
       return arr
    })
    res.render("clipes", {
        link: getClipesLinks,
        user_avatar: req.session.useravatar,
        username: req.session.username,
    })
})

router.post("/vote", async (req, res) => {
    const clipe = req.body.clipes
    const userid = req.session.userid
    if (!userid) {
        res.redirect("/error/unauthorized")
        return
    }

    const query = `UPDATE public.clipes SET count = count + 1 WHERE clip = '${clipe}'`

    const addUser = `INSERT INTO public.userclip(userid) VALUES (${userid})`
    const userExists = await db
        .query(`SELECT userid FROM public.userclip WHERE userid = ${userid}`)
        .then((res) => {
            return res.rows[0]
        })

    setTimeout(async () => {
        try {
            if (!userExists) {
                await db.query(addUser)
                await db.query(query)
                res.redirect("/clipes")
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
