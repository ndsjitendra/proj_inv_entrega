const router = require('express').Router();
const middleware = require('./middleware');

const apiUserEntryRouter = require('./api/userEntry.routes');
const apiUserRoutes = require('./api/user.routes');
const apiCompresorRoutes = require('./api/compresor.routes');
const apiRecordRoutes = require('./api/record.routes');
const apiStatsRoutes = require('./api/stats.routes');
const apiPaymentRoutes = require('./api/payment.routes');
const apiDistributorRoutes = require('./api/distributor.routes');
const apiAdminRoutes = require('./api/admin.routes');


router.use('/user', middleware.checkToken, apiUserRoutes);
router.use('/entryUser', apiUserEntryRouter);
router.use('/compresor', middleware.checkToken, apiCompresorRoutes);
router.use('/record', middleware.checkToken, apiRecordRoutes);
router.use('/stats', middleware.checkToken, apiStatsRoutes);
router.use('/payment', middleware.checkToken, apiPaymentRoutes);
router.use('/distributor', middleware.checkToken, apiDistributorRoutes);
router.use('/admin', middleware.checkToken, apiAdminRoutes);

module.exports = router;