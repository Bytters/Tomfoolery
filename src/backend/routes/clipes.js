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

    const clipeLinks = await db.query("SELECT * FROM public.clipes")

    const pushLinks = () => {
        let arr = []
        for (let i = 0; i < clipeLinks.rows.length; i++) {
            arr.push(clipeLinks.rows[i].clip)
        }
        return arr
    }

    res.render("clipes", {
        link: pushLinks(),
        user_avatar: req.session.useravatar,
        username: req.session.username,
    })
})

router.post("/vote", async (req, res) => {
    const clipe = req.body.clipes
    const userid = req.session.userid
    console.log(clipe)
    if (!userid) {
        res.redirect("/error/unauthorized")
        return
    }

    const action = {
        update:
            `UPDATE public.clipes SET count = count + 1 WHERE clip = '${clipe}'`,
        add: 
            `INSERT INTO public.userclip(userid, voted) VALUES (${userid}, ${clipe})`,
    }

    const userExists = (
        await db.query(
            `SELECT userid FROM public.userclip WHERE userid = ${userid}`
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
