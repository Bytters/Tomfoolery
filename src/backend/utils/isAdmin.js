const admins = [
    156586717,
    157358495,
    165801335, 
    191742635
]


module.exports = function isAdmin(req, res, userid) {
    let admin = false
    if(admins.includes(Number(userid))) {
        res.locals.admin = true
    }

}

