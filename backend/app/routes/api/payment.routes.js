const router = require('express').Router();
const { QueryTypes } = require('sequelize');
const sequelize = require('../../config/build-db');

const { db } = require('../../config/build-db');

router.get('/', (req, res) => {
    res.status(200).send("HOLA!!!!!!!!!!!!!!!");
});

router.post('/getPaymentInformation', async (req, res) => {
    await db.sequelize.query(
        `
        SELECT R.modelo,R.serie,R.garantia,P.status,P.totalAmount, P.balance,P.createdAt,P.updatedAt
        FROM payments AS P
        LEFT OUTER JOIN records AS R
        ON R.localId = P.localRecordId
        WHERE P.idUsername = ?
        AND DATE(P.createdAt) >= DATE(?)
        AND DATE(P.createdAt) <= DATE(?)
        `
        , { replacements: [req.body.username, req.body.compareDateBiggerThan, req.body.compareDateLesserThan], type: QueryTypes.SELECT }).then(function (result) {
            res.json({ result });
        });
});


module.exports = router;