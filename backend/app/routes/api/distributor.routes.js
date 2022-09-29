const router = require('express').Router();
const { QueryTypes } = require('sequelize');
const sequelize = require('../../config/build-db');

const { db, Distributor } = require('../../config/build-db');

router.get('/', (req, res) => {
    res.status(200).send("HOLA!!!!!!!!!!!!!!!");
});

router.get('/getAllDistributors', async (req, res) => {
    const distributors = await Distributor.findAll();
    res.json({ distributors });
})


module.exports = router;