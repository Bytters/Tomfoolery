module.exports = function isLogged(req, res) {
    let logged = false
    if (req.session.username) {
        res.locals.logged = true
    }
}
