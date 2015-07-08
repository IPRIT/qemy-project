var express = require('express');
var router = express.Router();
var mysqlPool = require('../db/mysql-connection');
var UsersManager = require('../users/manager');

router.get('/', function(req, res) {
    mysqlPool.connection(function(err, connection) {
        if (err) {
            console.log(err);
            return res.render('error/internal-error', {
                message: 'An internal error occurred',
                error: err
            });
        }
        var userManager = new UsersManager(connection);
        userManager.findUser({ id: 1 }, function(err, user) {
            if (err) {
                console.log(err);
                return res.render('error/internal-error', {
                    message: 'An internal error occurred',
                    error: err
                });
            }
            console.log(user._curInstance, user.getNick());
            user.beginTransaction()
                .setNick('IPRIT4')
                .commit(function(err, result) {
                    if (err) {
                        console.log(err);
                        return res.render('error/internal-error', {
                            message: 'An internal error occurred',
                            error: err
                        });
                    }
                    console.log(user.getNick(), user._curInstance);
                    res.render('index/index');
                });
        });
    });
});

router.get('/index', function(req, res) {
    res.end('Index!');
});

module.exports = router;