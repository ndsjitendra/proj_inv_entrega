const jwt = require('jwt-simple');
const moment = require('moment');

const checkToken = (req, res, next) => {

    if (!req.headers['user-token']) {
        return res.json({ error: 'NO TOKEN PROVIDED [user-token]' });
    }

    const userToken = req.headers['user-token'];
    let payload = {};

    try {
        payload = jwt.decode(userToken, 'secret key');
    } catch (error) {
        return res.json({ error: "INCORRECT TOKEN" });
    }

    if (payload.expiredAt < moment().unix()) {
        return res.json({ error: "EXPIRED TOKEN" });
    }

    req.userId = payload.userId;



    next();
}

module.exports = {
    checkToken: checkToken
}