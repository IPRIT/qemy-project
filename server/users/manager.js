var User = require('./user');

var UsersManager = function(dbConnection) {
    if (!dbConnection) {
        throw new TypeError('Connection should be not empty');
    }
    this._dbConnection = dbConnection;
};

UsersManager.prototype.findUser = function(searchFeatures, callback) {
    if (!searchFeatures || !(searchFeatures !== null && typeof searchFeatures === 'object')) {
        callback(new TypeError('Search features should not be empty.'));
    }
    var curUser;
    if (searchFeatures.id) {
        var userId = searchFeatures.id;
        curUser = new User(this._dbConnection);
        curUser.allocateById(userId, function(err, userInstance) {
            if (err) {
                return callback(err);
            }
            callback(null, userInstance);
        });
    } else if (searchFeatures.nick) {
        var userNick = searchFeatures.nick;
        curUser = new User(this._dbConnection);
        curUser.allocateByNick(userNick, function(err, userInstance) {
            if (err) {
                return callback(err);
            }
            callback(null, userInstance);
        });
    } else {
        callback(new Error('User not found'));
    }
};

UsersManager.prototype.addUser = function() {
    //todo it \o/, nothing is impossible, make your dreams come truth
    return 1;
};

module.exports = UsersManager;
