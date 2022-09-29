
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const nodeMailer = require('nodemailer');
const jwt = require('jwt-simple');
const date_fns = require('date-fns');
const { modifyPDFRegister } = require('./pdf-creation');
const path = require('path');
const { getFile } = require('../../s3');

const { User, Admin } = require('../../config/build-db');

router.get('/', (req, res) => {
    // res.status(200).send("HOLA!!!!!!!!!!!!!!!");
});

router.get('/getusers', async (req, res) => {
    const users = await User.findAll();
    res.status(200).send(String(users))
});

router.post('/register', [
    check('username', 'Empty Username').not().isEmpty(),
    check('username', 'Invalid Username').isEmail(),
    check('password', 'Invalid Password').not().isEmpty(),
    check('nombre', 'Falta nombre').not().isEmpty(),
    check('apellido', 'Falta apellido').not().isEmpty(),
    check('telefono', 'Falta telefono').not().isEmpty(),
    check('estado', 'Falta estado').not().isEmpty(),
    check('ciudad', 'Falta ciudad').not().isEmpty(),
    check('cp', 'Falta cp').not().isEmpty(),
    check('rfc', 'Falta rfc').not().isEmpty(),
    check('persona', 'Falta persona').not().isEmpty(),
    check('tarjeta', 'Falta tarjeta').not().isEmpty(),
    check('calleYnum', 'Falta calleYnum').not().isEmpty(),
    check('actividad', 'Falta actividad').not().isEmpty(),
    check('experiencia', 'Falta experiencia').not().isEmpty(),
    check('utilizadoCompresor', 'Falta utilizadoCompresor').not().isEmpty(),
    check('recibirInformacion', 'Falta recibirInformacion').not().isEmpty(),
    check('foto', 'Falta foto').not().isEmpty(),
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
            return res.json({ resp: 'User already exists' });
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
        // Cliente mail options
        const transporter = nodeMailer.createTransport({
            service: 'Hostinger',
            host: "mail.tecnicoautorizadoinvotech-mx.com",
            secureConnection: false,
            port: 465,
            auth: {
            user: "support@tecnicoautorizadoinvotech-mx.com",
            pass: "Prueba123"
            },
            tls: {
            ciphers: 'SSLv3'
            }
        });
          // Username mail options
        var mailOptionsAdmin = {
            from: 'support@tecnicoautorizadoinvotech-mx.com',
            to: req.body.username,
            subject: 'Invotech México -  Registro exitoso',
            text: `Se ha registrado de manera exitosa. Su matrícula es: ${matricula} .`,
        };
        var imgBuffer = decodeBase64Image(req.body.foto);
        const requestValues = {
            nombre: req.body.nombre + ' '+ req.body.apellido,
            matricula: matricula,
            foto: req.body.foto,
            tarjeta: req.body.tarjeta ? req.body.tarjeta : 'N.D.',
            username: req.body.username,
        }
        const pdfValues = await modifyPDFRegister(requestValues);
        const contractPath = path.join(__dirname, '../../assets/Contrato.pdf')
        const contractPDF = {
            filename: 'Contrato.pdf',
            path: contractPath,
            contentType: 'application/pdf'
        };
        mailOptionsAdmin.attachments = [{
            filename: 'Registro.pdf',
            path: pdfValues.path + pdfValues.fileName,
            contentType: 'application/pdf'
          },
        contractPDF];
        transporter.sendMail(mailOptionsAdmin,
            function (err, info) {
              if (err) {
                console.error(err);
                transporter.close();
              }
            });
        req.body.foto = imgBuffer.data;
        req.body.matricula = matricula;
        const user = await User.create(req.body);
        res.json(user);
    });

router.post('/login', async (req, res) => {
    const user = await User.findOne({ where: { username: req.body.username } });
    if (user) {
        const check = bcrypt.compareSync(req.body.password, user.password);
        if (check) {
            res.json({ success: createToken(user) });
        } else {
            res.json({ error: 'Incorrect password' });
        }
    } else {
        res.json({ error: 'Usuario o password no existe' });
    }
});

router.post('/loginAdmin', async (req, res) => {
    const user = await Admin.findOne({ where: { username: req.body.username } });
    if (user) {
        if (req.body.password === user.password) {
            res.json({ success: createToken(user) });
        } else {
            res.json({ error: 'Incorrect password' });
        }
    } else {
        res.json({ error: 'Usuario o password no existe' });
    }
});

const createToken = (user) => {
    const payload = {
        userId: user.id,
        createdAt: new Date(),
        expiredAt: date_fns.addDays(new Date(), 5)
    }

    return jwt.encode(payload, 'secret key');
}

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer.from(matches[2], 'base64');

    return response;
}

router.post('/getHelpPdf', async (req, res) => {
    var pdfLink = getFile(req.body.fileLocation);
    return res.json({ succ: pdfLink });
});

module.exports = router;
