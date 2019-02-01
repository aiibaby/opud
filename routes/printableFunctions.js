var express = require('express');
var router = express.Router();
const pg = require('pg');

router.post("/createPrint",function (req,resp) {
    req.session.roInfo = req.body;
    resp.send("Success");
});

router.post("/getROInfo", function(req, resp) {
    resp.send(req.session.roInfo);
});

module.exports = router;