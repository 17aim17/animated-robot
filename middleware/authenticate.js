module.exports = function (req, res, next) {

    if (req.user) {
        console.log('here');
        return next()
    }

    return res.redirect('/')

}
