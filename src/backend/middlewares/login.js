const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "..", "dotenv", ".env") })
const express = require("express")
const bodyParser = require("body-parser")
const axios = require("axios")
const router = express.Router()

router.get("/", async (req, res, next) => {
    const getCode = req.query.code

    const token = await axios.post(
        `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_ID}&client_secret=${process.env.TWITCH_CLIENT}&code=${getCode}&grant_type=authorization_code&redirect_uri=https://tomfoolery.herokuapp.com/users/login`
    )
    const acess = token.data["access_token"]
    const getUser = await axiosGET(acess)
    const userdata = getUser.data.data[0]

    req.session.username = userdata.login
    req.session.userid = userdata.id
    req.session.useravatar = userdata["profile_image_url"]

    res.redirect("/home")
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
