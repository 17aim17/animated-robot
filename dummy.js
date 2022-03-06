const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const User = require('../models/User');

module.exports = function (req, res, next) {

    client.verifyIdToken({
        idToken: req.user.accessToken,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    }).then((ticket) => {
        const payload = ticket.getPayload();
        return payload['sub'];
    }).then(gid => {
        return User.findOne({ googleID: gid })
    }).then((user) => {
        if (user) {
            next();
        }
    }).catch((e) => {
        console.log(e);
        return res.redirect('/')
    })


    return res.redirect('/')

}
