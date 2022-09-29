const router = require('express').Router();
const { QueryTypes } = require('sequelize');
const sequelize = require('../../config/build-db');

const { db, Compresor } = require('../../config/build-db');

router.get('/', (req, res) => {
    res.status(200).send("HOLA!!!!!!!!!!!!!!!");
});

router.post('/getCompresor', async (req, res) => {
    console.log("REQ BODY: ", req.body)
    await db.sequelize.query(
        'SELECT modelo, tipo, aplicacion, hp, refrigerante, conexion, voltaje, fases, btu FROM compresors WHERE modelo = ?', { replacements: [req.body.modelo], type: QueryTypes.SELECT }).then(function (compresor) {
            res.json({ compresor });
        });
});



router.get('/getCompresores', async (req, res) => {
    const compresores = await Compresor.findAll();
    res.json({ compresores });
})


module.exports = router;