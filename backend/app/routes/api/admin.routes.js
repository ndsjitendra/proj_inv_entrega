const router = require('express').Router();
const { QueryTypes } = require('sequelize');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const { db, Admin, Record, Compresor, User } = require('../../config/build-db');
const datefns = require('date-fns');
const nodeMailer = require('nodemailer');
const { pdfLib, PDFDocument, degrees, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');


var transporter = nodeMailer.createTransport({
    service: 'Hostinger',
    host: "mail.tecnicoautorizadoinvotech-mx.com",
    secure: true,
    port: 465,
    auth: {
        user: "_mainaccount@tecnicoautorizadoinvotech-mx.com",
        pass: "Invomex2021"
    }
});


router.get('/', (req, res) => {
    res.status(200).send("HOLA!!!!!!!!!!!!!!!");
});

router.get('/getUsers', async (req, res) => {
    const users = await User.findAll({
        order: [['createdAt', 'DESC']]
    });
    users.forEach((user) => {
        var bufferBase64 = new Buffer.from(user.foto).toString('base64');
        user.foto = 'data:image/jpeg;base64,' + bufferBase64;
    });
    res.json({ users });
});

router.get('/getRecords', async (req, res) => {
    const records = await Record.findAll({
        order: [['createdAt', 'DESC']]
    });
    records.forEach((value) => {
        var bufferBase64 = new Buffer.from(value.factura).toString('base64');
        value.factura = 'data:image/jpeg;base64,' + bufferBase64;
        if (value.placa) {
            var buffer2Base64 = new Buffer.from(value.placa).toString('base64');
            value.placa = 'data:image/jpeg;base64,' + buffer2Base64;
        }
    })
    res.json({ records });
});

router.get('/getCompresores', async (req, res) => {
    const compresores = await Compresor.findAll({
        order: [['modelo', 'DESC']]
    });
    res.json({ compresores });
});

router.post('/updateStatusRecord', async (req, res) => {
    const recordValue = await Record.findOne({ where: { id: req.body.id } });

    const requestValues = {
        status: req.body.status,
        location: recordValue.fileLocation
    };
    modifyPDF(requestValues);

    var mailOptionsCliente = {
        from: '_mainaccount@tecnicoautorizadoinvotech-mx.com',
        to: recordValue.correoCliente,
        subject: 'Invotech México - Equipo Registrado - Garantía Activada',
        text: 'PDF con su garantía activada.',
    };
    // Username mail options
    var mailOptions = {
        from: '_mainaccount@tecnicoautorizadoinvotech-mx.com',
        to: recordValue.username,
        subject: 'Invotech México - Equipo Registrado - Garantía Activada',
        text: 'PDF con su garantía activada.',
    };

    mailOptions.attachments = [{
        fileName: 'Garantía',
        path: requestValues.location,
        contentType: 'application/pdf'
    }];
    mailOptionsCliente.attachments = [{
        fileName: 'Garantía',
        path: requestValues.location,
        contentType: 'application/pdf'
    }];
    // Send email to user
    transporter.sendMail(mailOptions,
        function (err, info) {
            if (err) {
                console.error(err);
            } else {
            }
        });
    transporter.sendMail(mailOptionsCliente,
        function (err, info) {
            if (err) {
                console.error(err);
            } else {
            }
        });

    await db.sequelize.query(
        'UPDATE records SET status = ? WHERE id = ?', { replacements: [req.body.status, req.body.id], type: QueryTypes.UPDATE }).then(() => {
            res.json({ resp: 'success' });
        });

});

router.post('/updateCompresor', async (req, res) => {
    await Compresor.update({
        modelo: req.body.modelo,
        tipo: req.body.tipo,
        aplicacion: req.body.aplicacion,
        hp: req.body.hp,
        refrigerante: req.body.refrigerante,
        conexion: req.body.conexion,
        voltaje: req.body.voltaje,
        fases: req.body.fases,
        btu: req.body.btu,
        desc_prod: req.body.desc_prod,
        minimoPresionEvaporacion: req.body.minimoPresionEvaporacion,
        maximoPresionEvaporacion: req.body.maximoPresionEvaporacion,
        minimoTemperaturaEvaporacion: req.body.minimoTemperaturaEvaporacion,
        maximoTemperaturaEvaporacion: req.body.maximoTemperaturaEvaporacion,
        minimoPresionCondensacion: req.body.minimoPresionCondensacion,
        maximoPresionCondensacion: req.body.maximoPresionCondensacion,
        minimoTemperaturaCondensacion: req.body.minimoTemperaturaCondensacion,
        maximoTemperaturaCondensacion: req.body.maximoTemperaturaCondensacion,
        minimoTemperaturaFinal: req.body.minimoTemperaturaFinal,
        maximoTemperaturaFinal: req.body.maximoTemperaturaFinal
    },
        {
            where: {
                modelo: req.body.modelo
            }
        }
    );
    res.json({ resp: 'success' });
});

router.post('/newMassCompresor', [
    check('aplicacion', 'Falta aplicacion').not().isEmpty(),
    check('btu', 'Falta btu').not().isEmpty(),
    check('conexion', 'Falta conexion').not().isEmpty(),
    check('desc_prod', 'Falta desc_prod').not().isEmpty(),
    check('modelo', 'Falta modelo').not().isEmpty(),
    check('tipo', 'Falta tipo').not().isEmpty(),
    check('hp', 'Falta hp').not().isEmpty(),
    check('refrigerante', 'Falta refrigerante').not().isEmpty(),
    check('voltaje', 'Falta voltaje').not().isEmpty(),
    check('fases', 'Falta fases').not().isEmpty(),
    check('minimoPresionEvaporacion', 'Falta informacion').not().isEmpty(),
    check('maximoPresionEvaporacion', 'Falta informacion').not().isEmpty(),
    check('minimoTemperaturaEvaporacion', 'Falta informacion').not().isEmpty(),
    check('maximoTemperaturaEvaporacion', 'Falta informacion').not().isEmpty(),
    check('minimoPresionCondensacion', 'Falta informacion').not().isEmpty(),
    check('maximoPresionCondensacion', 'Falta informacion').not().isEmpty(),
    check('minimoTemperaturaCondensacion', 'Falta informacion').not().isEmpty(),
    check('maximoTemperaturaCondensacion', 'Falta informacion').not().isEmpty(),
    check('minimoTemperaturaFinal', 'Falta informacion').not().isEmpty(),
    check('maximoTemperaturaFinal', 'Falta informacion').not().isEmpty(),

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        }).send(errors);
    }
    await db.sequelize.query(
        "INSERT INTO  compresors ( modelo,tipo,aplicacion,hp,refrigerante,conexion,voltaje,fases,btu,desc_prod, minimoPresionEvaporacion,maximoPresionEvaporacion,minimoTemperaturaEvaporacion,maximoTemperaturaEvaporacion, minimoPresionCondensacion, maximoPresionCondensacion, minimoTemperaturaCondensacion,maximoTemperaturaCondensacion, minimoTemperaturaFinal,maximoTemperaturaFinal) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE tipo = VALUES(tipo), aplicacion = VALUES(aplicacion), hp = VALUES(tipo), hp = VALUES(hp), refrigerante = VALUES(refrigerante), conexion = VALUES(conexion), voltaje= VALUES(voltaje), fases=VALUES(fases), btu=VALUES(btu), desc_prod=VALUES(desc_prod), minimoPresionEvaporacion = VALUES(minimoPresionEvaporacion), maximoPresionEvaporacion = VALUES(maximoPresionEvaporacion), minimoTemperaturaEvaporacion = VALUES(minimoTemperaturaEvaporacion), maximoTemperaturaEvaporacion = VALUES(maximoTemperaturaEvaporacion), minimoPresionCondensacion = VALUES(minimoPresionCondensacion), maximoPresionCondensacion= VALUES(maximoPresionCondensacion), minimoTemperaturaCondensacion = VALUES(minimoTemperaturaCondensacion), maximoTemperaturaCondensacion = VALUES(maximoTemperaturaCondensacion), minimoTemperaturaFinal = VALUES(minimoTemperaturaFinal), maximoTemperaturaFinal = VALUES(maximoTemperaturaFinal)", { replacements: [req.body.modelo, req.body.tipo, req.body.aplicacion, req.body.hp, req.body.refrigerante, req.body.conexion, req.body.voltaje, req.body.fases, req.body.btu, req.body.desc_prod, req.body.minimoPresionEvaporacion, req.body.maximoPresionEvaporacion, req.body.minimoTemperaturaEvaporacion, req.body.maximoTemperaturaEvaporacion, req.body.minimoPresionCondensacion, req.body.maximoPresionCondensacion, req.body.minimoTemperaturaCondensacion, req.body.maximoTemperaturaCondensacion, req.body.minimoTemperaturaFinal, req.body.maximoTemperaturaFinal] }).then((compresor) => {
            res.json({ resp: "success" });
        });
});

router.post('/newCompresor', [
    check('aplicacion', 'Falta aplicacion').not().isEmpty(),
    check('btu', 'Falta btu').not().isEmpty(),
    check('conexion', 'Falta conexion').not().isEmpty(),
    check('desc_prod', 'Falta desc_prod').not().isEmpty(),
    check('modelo', 'Falta modelo').not().isEmpty(),
    check('tipo', 'Falta tipo').not().isEmpty(),
    check('hp', 'Falta hp').not().isEmpty(),
    check('refrigerante', 'Falta refrigerante').not().isEmpty(),
    check('voltaje', 'Falta voltaje').not().isEmpty(),
    check('fases', 'Falta fases').not().isEmpty(),
    check('minimoPresionEvaporacion', 'Falta informacion').not().isEmpty(),
    check('maximoPresionEvaporacion', 'Falta informacion').not().isEmpty(),
    check('minimoTemperaturaEvaporacion', 'Falta informacion').not().isEmpty(),
    check('maximoTemperaturaEvaporacion', 'Falta informacion').not().isEmpty(),
    check('minimoPresionCondensacion', 'Falta informacion').not().isEmpty(),
    check('maximoPresionCondensacion', 'Falta informacion').not().isEmpty(),
    check('minimoTemperaturaCondensacion', 'Falta informacion').not().isEmpty(),
    check('maximoTemperaturaCondensacion', 'Falta informacion').not().isEmpty(),
    check('minimoTemperaturaFinal', 'Falta informacion').not().isEmpty(),
    check('maximoTemperaturaFinal', 'Falta informacion').not().isEmpty(),

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        }).send(errors);
    }
    const compresorExists = await Compresor.findOne({ where: { modelo: req.body.modelo } });
    if (compresorExists) {
        return res.json({ resp: 'exists' });
    }
    await Compresor.create(req.body);
    res.json({ resp: 'success' });
});

router.post('/deleteCompresor', async (req, res) => {
    await Compresor.destroy({
        where: {
            id: req.body.id
        }
    });
    res.json({ resp: 'success' });
});

router.post('/registerUser', [
    check('username', 'Empty Username').not().isEmpty(),
    check('username', 'Invalid Username').isEmail(),
    check('password', 'Invalid Password').not().isEmpty(),
    check('nombre', 'Falta nombre').not().isEmpty(),
    check('apellido', 'Falta apellido').not().isEmpty(),
    check('telefono', 'Falta telefono').not().isEmpty(),
    check('estado', 'Falta estado').not().isEmpty(),
    check('ciudad', 'Falta ciudad').not().isEmpty(),
    check('cp', 'Falta cp').not().isEmpty(),
    check('calleYnum', 'Falta calleYnum').not().isEmpty(),
    check('actividad', 'Falta actividad').not().isEmpty(),
    check('experiencia', 'Falta experiencia').not().isEmpty(),
    check('utilizadoCompresor', 'Falta utilizadoCompresor').not().isEmpty(),
    check('recibirInformacion', 'Falta recibirInformacion').not().isEmpty(),
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            }).send(errors);
        }
        const userExists = await User.findOne({ where: { username: req.body.username } });
        if (userExists) {
            return res.json({ resp: 'exists' });
        }
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        // Generar matricula y checar que no exista antes de proceder
        let matricula = 0;
        let noExisteMatricula = false;
        do {
            matricula = Math.floor(1000000 + Math.random() * 9000000);
            const checkMatricula = await User.findOne({ where: { matricula: matricula } });
            if (!checkMatricula) {
                noExisteMatricula = true;
            }
        }
        while (!noExisteMatricula);
        req.body.matricula = matricula;
        await User.create(req.body);
        res.json({ resp: 'success' });
    });

router.post('/updateUser', async (req, res) => {
    await User.update({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        telefono: req.body.telefono,
        estado: req.body.estado,
        ciudad: req.body.ciudad,
        cp: req.body.cp,
        calleYnum: req.body.calleYnum,
        actividad: req.body.actividad,
        experiencia: req.body.experiencia,
        utilizadoCompresor: req.body.utilizadoCompresor,
        recibirInformacion: req.body.recibirInformacion
    },
        {
            where: {
                username: req.body.username
            }
        });
    res.json({ resp: 'success' });
});

router.post('/deleteUser', async (req, res) => {
    console.log("REQ BODYL ", req.body)
    await User.destroy({
        where: {
            id: req.body.id
        }
    });
    res.json({ resp: 'success' });
});

router.post('/enableUserSync', async (req, res) => {
    console.log("REQ BODYL ", req.body)
    await User.update({
        userSync: 1
    }, {
        where: {
            userSync: 0
        }
    });
    res.json({ resp: 'success' });
});

router.post('/disableUserSync', async (req, res) => {
    console.log("REQ BODYL ", req.body)
    await User.update({
        userSync: 0
    }, {
        where: {
            userSync: 1
        }
    })
    res.json({ resp: 'success' });
})

async function modifyPDF(requestValues) {

    // Create File for saving

    const pdfDoc = await PDFDocument.load(fs.readFileSync(requestValues.location));
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const fontSizeSmall = 10;
    const fontSizeMedium = 20;
    const { width, height } = firstPage.getSize();

    let response = "";
    if (requestValues.status === 'APPROVED') {
        response = "¡Garantía Aprobada!";
        color = rgb(0.15, .75, 0.1);
    } else {
        response = "Garantia Denegada.";
        color = rgb(1, 0, 0);
    }

    //Fecha de Vigencia
    firstPage.drawText(response, {
        x: 400,
        y: height - 595,
        size: fontSizeMedium,
        font: helveticaFont,
        color: color
    });


    fs.writeFileSync(requestValues.location, await pdfDoc.save());

    return;

}


module.exports = router;