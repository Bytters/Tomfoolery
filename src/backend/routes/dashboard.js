const express = require("express")
const router = express.Router()
const db = require("../database/database")
const isLogged = require("../utils/logged")
const isAdmin = require("../utils/isAdmin")
const admins = [156586717, 157358495, 165801335, 191742635]

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

function verifyAdmin(req, res, Render) {
    isLogged(req, res)
    isAdmin(req, res, req.session.userid)

    if (!req.session.userid) {
        res.redirect("/home")
    } else if (admins.includes(Number(req.session.userid))) {
        res.render(`${Render}.ejs`, {
            user_avatar: req.session.useravatar,
            username: req.session.username,
        })
    } else {
        res.redirect("/error/forbidden")
    }
}

router.get("/", (req, res) => {
    isLogged(req, res)
    isAdmin(req, res, req.session.userid)

    verifyAdmin(req, res, "dashboard")
})

router.get("/resultados", async (req, res) => {
    isAdmin(req, res, req.session.userid)
    isLogged(req, res)

    if (!req.session.userid) {
        res.redirect("/home")
    } else if (admins.includes(Number(req.session.userid))) {
        const getEmotes = await db
            .query("SELECT * FROM public.emotes ORDER BY count DESC")
            .then((res) => {
                return res.rows
            })

        const getClipes = await db
            .query("SELECT * FROM public.clipes ORDER BY count DESC")
            .then((res) => {
                return res.rows
            })
        res.render("resultados.ejs", {
            emotes: getEmotes,
            clipes: getClipes,
            user_avatar: req.session.useravatar,
            username: req.session.username,
        })
    } else {
        res.redirect("/error/forbidden")
    }
})

router.get("/upload", async (req, res) => {
    isLogged(req, res)
    isAdmin(req, res, req.session.userid)
    verifyAdmin(req, res, "upload")
})

router.get("/upload/halloffame", async (req, res) => {
    isLogged(req, res)
    isAdmin(req, res, req.session.userid)
    verifyAdmin(req, res, "uploadHallofame")
})

router.post("/upload/halloffame/add", async (req, res) => {
    isLogged(req, res)
    isAdmin(req, res, req.session.userid)
    const hof = {
        month: req.body.month.toLowerCase(),
        emote: req.body.emote,
        clipe: req.body.clipe,
    }
    if (!req.session.userid) {
        res.redirect("/home")
    } else if (admins.includes(Number(req.session.userid))) {
        await db.query(
            `INSERT INTO public.halloffame(mes, emote, clipe) VALUES('${hof.month}', '${hof.emote}', '${hof.clipe}')`
        )
        res.redirect("https://tomfoolery.herokuapp.com/admin/dashboard/upload/halloffame")
    } else {
        res.redirect("/error/forbidden")
    }
})

router.get("/upload/clipes", async (req, res) => {
    isLogged(req, res)
    isAdmin(req, res, req.session.userid)

    verifyAdmin(req, res, "uploadClipes")
})

router.get("/upload/emotes", async (req, res) => {
    isLogged(req, res)
    isAdmin(req, res, req.session.userid)
    verifyAdmin(req, res, "uploadEmotes")
})

router.get("/upload/clipes", async (req, res) => {
    isLogged(req, res)
    isAdmin(req, res, req.session.userid)
    verifyAdmin(req, res, "uploadClipes")
})

router.post("/upload/emotes/add", async (req, res) => {
    isLogged(req, res)
    isAdmin(req, res, req.session.userid)

    
    
    if (!req.session.userid) {
        res.redirect("/home")
    } else if (admins.includes(Number(req.session.userid))) {
        await db.query(
            `INSERT INTO public.emotes(name, link, count) VALUES('${req.body.emote_name}', '${req.body.emote_link}', 0)`
        )
        res.redirect("https://tomfoolery.herokuapp.com/admin/dashboard/upload/emotes")
    } else {
        res.redirect("/error/forbidden")
    }
})

router.post("/upload/clipes/add", async (req, res) => {
    isLogged(req, res)
    isAdmin(req, res, req.session.userid)

    if (!req.session.userid) {
        res.redirect("/home")
    } else if (admins.includes(Number(req.session.userid))) {
        await db.query(
            `INSERT INTO public.clipes(name, clip, count) VALUES('${req.body.clipe_name}', '${req.body.clipe_link}', 0)`
        )
        res.redirect("https://tomfoolery.herokuapp.com/admin/dashboard/upload/clipes")
    } else {
        res.redirect("/error/forbidden")
    }
})

module.exports = router
