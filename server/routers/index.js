var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('index/index');
});

router.get('/index', function(req, res) {
    res.end('Index!');
});

module.exports = router;