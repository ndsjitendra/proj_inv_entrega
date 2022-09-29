const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const { db, Record, Payment, Compresor } = require('../../config/build-db');
const nodeMailer = require('nodemailer');
const { pdfLib, PDFDocument, degrees, rgb, StandardFonts } = require('pdf-lib');
const { uploadFile, getFile } = require('../../s3');
const path = require('path');
const fs = require('fs');
const date_fns = require('date-fns');
const { QueryTypes } = require('sequelize');

router.get('/', (req, res) => {
  res.status(200).send("HOLA!!!!!!!!!!!!!!!");
});

router.post('/getRecordsForUser', async (req, res) => {
  const { count, rows } = await Record.findAndCountAll({
    where: {
      username: req.body.username
    },
    order: [
      ['createdAt', 'DESC']
    ],
    limit: 5,
    offset: req.body.offset,
  })
  if (rows && rows.length > 0) {
    rows.forEach((value) => {
      var bufferBase64 = new Buffer.from(value.factura).toString('base64');
      value.factura = 'data:image/jpeg;base64,' + bufferBase64;
    });
    res.json({ result: rows, count: count });
  } else {
    res.json({ resp: 'No Records Found' })
  }
});

router.post('/getAllRecordsForUser', async (req, res) => {
  const { count, rows } = await Record.findAndCountAll({
    where: {
      username: req.body.username
    },
    order: [
      ['createdAt', 'DESC']
    ]
  });
  if (rows && rows.length > 0) {
    rows.forEach((value) => {
      value.factura = '';
    });
    res.json({ result: rows, count: count });
  } else {
    res.json({ resp: 'No Records Found' });
  }
});

router.post('/getRecordTileInformation', async (req, res) => {
  await db.sequelize.query(
    `
    SELECT modelo,serie,localId,createdAt
    FROM records 
    WHERE username = ?
    ORDER BY createdAt DESC
    `
    , { replacements: [req.body.username], type: QueryTypes.SELECT }).then(function (result) {
      res.json({ result });
    });
});

router.post('/getRecord', async (req, res) => {
  const record = await Record.findOne({ where: { localId: req.body.localId } })
  if (record) {
    var bufferBase64 = new Buffer.from(record.dataValues.factura).toString('base64');
    record.dataValues.factura = 'data:image/jpeg;base64,' + bufferBase64;
    return res.json({ succ: record.dataValues })
  }
});

router.post('/getRecordPdf', async (req, res) => {
  const record = await Record.findOne({ where: { localId: req.body.recordLocalId } });
  if (record.username !== req.body.username) {
    return res.status(422).json({ err: 'Invalid user/record petition' });
  }
  if (record) {
    var pdfLink = getFile(record.fileLocation);
    return res.json({ succ: pdfLink });
  }
});

router.post('/checkSerial', async (req, res) => {
  const serialExists = await Record.findOne({
    where: {
      modelo: req.body.modelo,
      serie: req.body.serie
    }
  });
  if (serialExists) {
    return res.json({ err: 'Serial already exists' });
  } else {
    return res.json({ succ: 'Serial does not exist!' });
  }
});

router.post('/updateRecordStatus', async (req, res) => {
  await Record.update({
    status: req.body.status
  }, {
    where: {
      localId: req.body.recordLocalId
    }
  });
  const record = await Record.findOne({
    where: {
      localId: req.body.recordLocalId
    }
  });
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
    to: 'garantias@invotech-mx.com',
    subject: 'Invotech México -  Reclamo de Garantía',
    text: `Se levanto de manera exitosa el reclamo de garantía ${record.garantia}`,
  };

  var mailOptionsCliente = {
    from: 'support@tecnicoautorizadoinvotech-mx.com',
    to: record.username,
    subject: 'Invotech México - Reclamo de Garantía',
    text: `Se levanto de manera exitosa el reclamo de garantía ${record.garantia}`,
  };

  transporter.sendMail(mailOptionsAdmin,
    function (err, info) {
      if (err) {
        console.error(err);
        transporter.close();
      }
    });

  transporter.sendMail(mailOptionsCliente,
    function (err, info) {
      if (err) {
        console.error(err);
        transporter.close();
      }
    });

  res.json({ resp: 'success' })
});

router.post('/registerRecord', [
  check('modelo', 'Empty compresorModel').not().isEmpty(),
  check('serie', 'Invalid compresorSerial').not().isEmpty(),
  check('distribuidor', 'Falta distribuidor').not().isEmpty(),
  check('factura', 'Falta factura').not().isEmpty(),
  check('fechaCompra', 'Falta telefechaComprafono').not().isEmpty(),
  check('modeloCompresorReemplazarCliente', 'Falta modeloCompresorReemplazarCliente').not().isEmpty(),
  check('telefonoCliente', 'Falta telefonoCliente').not().isEmpty(),
  check('nombreCliente', 'Falta nombreCliente').not().isEmpty(),
  check('correoCliente', 'Invalid correoCliente').isEmail(),
  check('estadoCliente', 'Invalid estadoCliente').not().isEmpty(),
  check('tipoGarantia', 'Falta tipoGarantia').not().isEmpty(),
  check('checklistComplete', 'Falta checklistComplete').not().isEmpty(),
  check('vendedor', 'Falta vendedor').not().isEmpty(),
  check('sucursal', 'Falta sucursal').not().isEmpty(),
  check('modeloCompresorCliente', 'Falta modeloCompresorCliente').not().isEmpty(),
  check('maquinaCliente', 'Falta maquinaCliente').not().isEmpty(),
  check('presionEvaporacion', 'Falta presionEvaporacion').not().isEmpty(),
  check('temperaturaEvaporacion', 'Falta temperaturaEvaporacion').not().isEmpty(),
  check('presionCondensacion', 'Falta presionCondensacion').not().isEmpty(),
  check('temperaturaCondensacion', 'Falta temperaturaCondensacion').not().isEmpty(),
  check('contactorCapacitor', 'Falta contactorCapacitor').not().isEmpty(),
  check('superiorCapacitor', 'Falta superiorCapacitor').not().isEmpty(),
  check('compresorSoldado', 'Falta compresorSoldado').not().isEmpty(),
  check('instalacion', 'Falta instalacion').not().isEmpty(),
  check('temperaturaFinal', 'Falta temperaturaFinal').not().isEmpty(),
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }
    const readPath = path.join(__dirname, '../../assets', 'pdf-generated-files/');
    const readDir = fs.readdirSync(readPath);
    readDir.forEach((file) => {
      const filePath = path.join(readPath, file);
      fs.rmSync(filePath, { recursive: true, force: true });
    });
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

    var mailOptionsCliente = {
      from: 'support@tecnicoautorizadoinvotech-mx.com',
      to: req.body.correoCliente,
      subject: 'Invotech México - Equipo Registrado - Garantía Activada',
      text: 'PDF con su garantía activada.',
    };
    // Username mail options
    var mailOptions = {
      from: 'support@tecnicoautorizadoinvotech-mx.com',
      to: req.body.username,
      subject: 'Invotech México - Equipo Registrado - Garantía Activada',
      text: 'PDF con su garantía activada.',
    };

    // Generar garantia y checar que no exista antes de proceder
    let garantia = '';
    let noExisteGarantia = false;
    do {
      garantia = req.body.matricula + '-' + Math.floor(1000000 + Math.random() * 9000000);
      const checkGarantia = await Record.findOne({ where: { garantia: garantia } });
      if (!checkGarantia) {
        noExisteGarantia = true;
      }
    }
    while (!noExisteGarantia);

    const requestValues = {
      tecnico: req.body.nombreTecnico,
      cliente: req.body.nombreCliente,
      aplicacion: req.body.aplicacion,
      modelo: req.body.modelo,
      matricula: req.body.matricula,
      tipoGarantia: req.body.tipoGarantia,
      garantia: garantia,
      serie: req.body.serie,
      username: req.body.username,
    }
    const pdfValues = await modifyPDF(requestValues);

    /* SAVE PDF TO S3 BUCKET */

    try {
      const path = pdfValues.path + pdfValues.fileName;
      await uploadFile(pdfValues.fileName, path);
    } catch (err) {
      console.log("ERROR: ", err);
    }

    /* SEND PDF TO CORRESPONDING EMAILS */

    mailOptions.attachments = [{
      filename: 'Garantia.pdf',
      path: pdfValues.path + pdfValues.fileName,
      contentType: 'application/pdf'
    }];
    mailOptionsCliente.attachments = [{
      filename: 'Garantia.pdf',
      path: pdfValues.path + pdfValues.fileName,
      contentType: 'application/pdf'
    }];
    // Send email to user
    transporter.sendMail(mailOptions,
      function (err, info) {
        if (err) {
          console.error(err);
          transporter.close();
        }
      });
    transporter.sendMail(mailOptionsCliente,
      function (err, info) {
        if (err) {
          console.error(err);
          transporter.close();
        }
      });
    transporter.close();
    var imgBuffer = decodeBase64Image(req.body.factura);
    const contactorCapacitorBuffer = decodeBase64Image(req.body.contactorCapacitor);
    const superiorCapacitorCapacitor = decodeBase64Image(req.body.superiorCapacitor);
    const compresorSoldadoBuffer = decodeBase64Image(req.body.compresorSoldado);
    const instalacionBuffer = decodeBase64Image(req.body.instalacion);
    if (req.body.tipoGarantia === 'condicionada') {
      req.body.status = 'CONDICIONADA';
    } else {
      req.body.status = 'APROBADA';
    }
    req.body.factura = imgBuffer.data;
    req.body.contactorCapacitor = contactorCapacitorBuffer.data;
    req.body.superiorCapacitor = superiorCapacitorCapacitor.data;
    req.body.compresorSoldado = compresorSoldadoBuffer.data;
    req.body.instalacion = instalacionBuffer.data;
    req.body.garantia = garantia;
    req.body.fileLocation = pdfValues.fileName;
    const paymentAmount = await checkTotalAmount(req.body.modelo);
    const paymentInformation = {
      status: 'PENDING',
      idUsername: req.body.username,
      localRecordId: req.body.localId,
      totalAmount: paymentAmount,
      balance: paymentAmount,
    }
    await Record.create(req.body);
    await Payment.create(paymentInformation);
    res.json({ succ: 'success' });
  });

async function checkTotalAmount(modelo) {
  const checkCompresor = await Compresor.findOne({ where: { modelo: modelo } });
  const hpNumber = parseFloat(checkCompresor.hp.trim().replace('HP', ''));
  let totalAmount;
  if (hpNumber >= 2 && hpNumber < 10) {
    totalAmount = 200;
  } else if (hpNumber >= 10 && hpNumber <= 15) {
    totalAmount = 300;
  } else if (hpNumber >= 25 && hpNumber <= 30) {
    totalAmount = 500;
  }
  return totalAmount;
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

async function modifyPDF(requestValues) {

  // Create File for saving
  const date = date_fns.format(new Date(), 'T');
  const pathCreate = path.join(__dirname, '../../assets/pdf-generated-files/')
  const fileName = requestValues.matricula + '-' + date + '.pdf';
  const file_descriptor = fs.openSync(pathCreate + fileName, 'w');

  const path2 = path.join(__dirname, '../../assets/EQUIPO_INVOTECH_REGISTRADO.pdf');
  const pdfDoc = await PDFDocument.load(fs.readFileSync(path2));
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

  const doc = await PDFDocument.create();

  const [page] = await doc.copyPages(pdfDoc, [0]);
  doc.addPage(page);
  const pages = doc.getPages();
  const firstPage = pages[0];
  const fontSizeSmall = 10;
  const fontSizeMedium = 20;
  const { width, height } = firstPage.getSize()

  /* DRAWING ON PDF */
  const registerDate = date_fns.format(new Date(), "dd-MM-yyyy");
  const expiryDate = date_fns.format(date_fns.addMonths(new Date(), 12), "dd-MM-yyyy");


  firstPage.drawText(registerDate, {
    x: 420,
    y: height - 20,
    size: fontSizeSmall,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });
  // Garantia
  firstPage.drawText(requestValues.garantia, {
    x: 420,
    y: height - 40,
    size: fontSizeSmall,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });
  //Fecha de Vigencia
  firstPage.drawText(expiryDate, {
    x: 440,
    y: height - 645,
    size: fontSizeSmall,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });
  // STATUS
  if (requestValues.tipoGarantia === 'condicionada') {
    firstPage.drawText('GARANTÍA CONDICIONADA - EN REVISIÓN', {
      x: 150,
      y: height - 595,
      size: fontSizeMedium,
      font: timesRomanFont,
      color: rgb(1, 0, 0),
    });
  } else {
    firstPage.drawText('GARANTÍA APROBADA', {
      x: 150,
      y: height - 595,
      size: fontSizeMedium,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
  }

  firstPage.drawText(requestValues.modelo, {
    x: 280,
    y: height - 260,
    size: fontSizeMedium,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(requestValues.serie, {
    x: 280,
    y: height - 295,
    size: fontSizeMedium,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });

  // Presencia de espuma
  firstPage.drawText('PRUEBAS', {
    x: 450,
    y: height - 435,
    size: fontSizeSmall,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });

  // Temperatura Liquida
  firstPage.drawText('PRUEBAS', {
    x: 450,
    y: height - 420,
    size: fontSizeSmall,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  })

  // Temperatura de Aplicacion
  firstPage.drawText('PRUEBAS', {
    x: 235,
    y: height - 432,
    size: fontSizeSmall,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  })

  firstPage.drawText(requestValues.tecnico, {
    x: 125,
    y: height - 365,
    size: fontSizeSmall,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(requestValues.cliente, {
    x: 125,
    y: height - 380,
    size: fontSizeSmall,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  })

  firstPage.drawText(requestValues.aplicacion, {
    x: 135,
    y: height - 420,
    size: fontSizeSmall,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  })

  // Presion de succion
  firstPage.drawText('PRUEBAS', {
    x: 270,
    y: height - 480,
    size: fontSizeSmall,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  })

  // Temperatura de succion
  firstPage.drawText('PRUEBAS', {
    x: 270,
    y: height - 495,
    size: fontSizeSmall,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  })

  // Presion de descarga
  firstPage.drawText('PRUEBAS', {
    x: 270,
    y: height - 510,
    size: fontSizeSmall,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  })
  // Temperatura de descarga
  firstPage.drawText('PRUEBAS', {
    x: 270,
    y: height - 525,
    size: fontSizeSmall,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  })
  // temperatura final del sistema
  firstPage.drawText('PRUEBAS', {
    x: 270,
    y: height - 540,
    size: fontSizeSmall,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  })


  const fileNameValues = {
    fileName: fileName,
    path: pathCreate
  }

  fs.writeFileSync(pathCreate + fileName, await doc.save());

  fs.close(file_descriptor);
  return fileNameValues;

}

module.exports = router;
