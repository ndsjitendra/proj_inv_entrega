const router = require('express').Router();
const { QueryTypes } = require('sequelize');
const { db, User } = require('../../config/build-db');
const { uploadFile, getFile } = require('../../s3');


router.get('/', (req, res) => {
    res.status(200).send("HOLA!!!!!!!!!!!!!!!");
});

router.post('/getUser', async (req, res) => {
    await db.sequelize.query(
        'SELECT id, nombre, apellido, telefono, estado, ciudad, banco, cp,persona,tarjeta,clabe,rfc, calleYnum, actividad, experiencia, recibirInformacion, foto, matricula, username, localId FROM users WHERE id = ?', { replacements: [req.body.id], type: QueryTypes.SELECT }).then(function (user) {
            var bufferBase64 = new Buffer.from(user[0].foto).toString('base64');
            user[0].foto = 'data:image/jpeg;base64,' + bufferBase64;
            res.json({ user });
        });
});

router.post('/getSyncStatus', async (req, res) => {
    await db.sequelize.query(
        'SELECT userSync from users WHERE id = ?', {
        replacements: [req.body.id], type: QueryTypes.SELECT
    }).then((response) => {
        res.json({ resp: response[0] });
    });
});

router.post('/updateSyncStatus', async (req, res) => {
    await User.update({
        userSync: 0
    }, {
        where: {
            id: req.body.id
        }
    });
    res.json({ resp: 'success' })
});

router.post('/getHelpPdf', async (req, res) => {
    var pdfLink = getFile(req.body.fileLocation);
    return res.json({ succ: pdfLink });
});


module.exports = router;