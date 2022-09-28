const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "..", "dotenv", ".env") })
const express = require("express")
const bodyParser = require("body-parser")
const axios = require("axios")
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
router.use(express.json())

router.get("/", async (req, res, next) => {
    const getCode = req.query.code

    const getToken = await axios
        .post(
            `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_ID}&client_secret=${process.env.TWITCH_CLIENT}&code=${getCode}&grant_type=authorization_code&redirect_uri=https://tomfoolery.herokuapp.com/users/login`
        )
        .then((response) => {
            const acess = response.data.access_token
            axiosGET(acess)
                .then((i) => {
                    req.session.username = i.data.data[0].login
                    req.session.userid = i.data.data[0].id
                    req.session.useravatar = i.data.data[0].profile_image_url
                    res.redirect("/home")
                })
                .catch((err) => {
                    console.log(err)
                })
        })
        .catch((err) => {
            return err
        })
})

router.get("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            res.redirect("/home")
            if (err) {
                console.log(err)
            }
        })
    }
})

async function axiosGET(acess_token) {
    const res = await axios({
        url: "https://api.twitch.tv/helix/users",
        method: "GET",
        headers: {
            "Client-ID": process.env.TWITCH_ID,
            Authorization: `Bearer ${acess_token}`,
        },
    })
    return res
}

module.exports = router
