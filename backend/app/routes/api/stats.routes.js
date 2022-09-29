const router = require('express').Router();
const { QueryTypes } = require('sequelize');
const sequelize = require('../../config/build-db');

const { db } = require('../../config/build-db');

router.get('/', (req, res) => {
    res.status(200).send("HOLA!!!!!!!!!!!!!!!");
});

router.post('/getFilteredStats', async (req, res) => {
    // console.log("REQ BODY: ", req.body)
    await db.sequelize.query(
        `
        SELECT R.modelo,R.serie, C.aplicacion, C.hp, C.refrigerante 
        FROM compresors AS C
        LEFT OUTER JOIN records AS R
        ON C.modelo = R.modelo
        WHERE R.username = ?
        AND DATE(R.createdAt) >= DATE(?)
        AND DATE(R.createdAt) <= DATE(?)
        `
        , { replacements: [req.body.username, req.body.compareDateBiggerThan, req.body.compareDateLesserThan], type: QueryTypes.SELECT }).then(function (result) {
            res.json({ result });
        });
});

module.exports = router;