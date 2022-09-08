// const cors = require('cors');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const propierties = require('./app/config/db.config');
const apiRouter = require('./app/routes/api');


const app = express();

require('./app/config/build-db');
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }, { limit: '50mb' }));

app.use('/api', apiRouter)

// require("./app/routes/user.routes")(app);
app.listen(propierties.PORT, () => console.log('Server runing on port ' + propierties.PORT));