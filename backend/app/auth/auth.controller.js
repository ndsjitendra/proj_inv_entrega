const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'secretkey123';


exports.createUser = (req, res, next) => {

    if (!req.body.username || !req.body.password) {
        res.status(400).send({
            message: "Missing fields!"
        });
        return;
    }
    const newUser = {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    }

    User.create(newUser).then(data => {
        const expiresIn = '1h';
        const accessToken = jwt.sign({ id: user.Id },
            SECRET_KEY, {
            expiresIn: expiresIn
        });

        const dataUser = {
            name: user.name,
            username: user.username,
            accessToken: accessToken,
            expiresIn: expiresIn
        }

        // Server response
        res.send({ dataUser });
    }).catch(err => {
        if (error) {
            return res.stats(500).send('Server Error');
        }
    });

}

exports.loginUser = (req, res, next) => {
    const userData = {
        username: req.body.username,
        password: req.body.password
    }

    //CHECK FOR MY SQL FOR USER
}