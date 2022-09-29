
const { pdfLib, PDFDocument, degrees, rgb, StandardFonts, decodeFromBase64 } = require('pdf-lib');
const date_fns = require('date-fns');
const fs = require('fs');
const path = require('path');
// Upload file to S3 bucket


async function modifyPDFRecord(requestValues) {

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
  

async function modifyPDFRegister(requestValues) {

    // Create File for saving
    const date = date_fns.format(new Date(), 'T');
    const pathCreate = path.join(__dirname, '../../assets/pdf-generated-files/')
    const fileName = requestValues.matricula + '-' + date + '.pdf';
    const file_descriptor = fs.openSync(pathCreate + fileName, 'w');
  
    const path2 = path.join(__dirname, '../../assets/Registro.pdf');
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
  
    firstPage.drawText(requestValues.nombre, {
      x: 120,
      y: height - 400,
      size: fontSizeSmall,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    // Matricula
    firstPage.drawText(requestValues.matricula+'', {
      x: 120,
      y: height - 410,
      size: fontSizeSmall,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    //Fecha de Registro
    firstPage.drawText(registerDate, {
      x: 120,
      y: height - 420,
      size: fontSizeSmall,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(requestValues.tarjeta, {
      x: 70,
      y: height - 510,
      size: fontSizeSmall,
      font: timesRomanFont,
      color: rgb(1,1,1),
    });

    const fileNameValues = {
      fileName: fileName,
      path: pathCreate
    }
  
    fs.writeFileSync(pathCreate + fileName, await doc.save());
  
    fs.close(file_descriptor);
    return fileNameValues;
  
  }

exports.modifyPDFRecord = modifyPDFRecord;
exports.modifyPDFRegister = modifyPDFRegister;