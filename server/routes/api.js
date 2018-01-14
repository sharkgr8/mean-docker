// Import dependencies
const express = require('express');
const router = express.Router();
const app = require('../server');
const apiRouter = require("../controllers/auth.api");

/* GET api listing. */
router.get('/', (req, res) => {
        res.send('api works');
});

//routes for user api
router.use("/api", apiRouter);

//routes for user api
router.use("/adminusers", require("../controllers/admin-user.api"));
router.use("/audio", require("../controllers/audio.api"));
router.use("/uploader", require("../lib/flow.js/app"));
router.use("/s3uploader", require("../lib/aws-uploader/app1"));

module.exports = router;