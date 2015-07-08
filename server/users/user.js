var User = function(dbConnection) {
    if (!dbConnection) {
        throw new TypeError('Connection should be not empty');
    }
    this._dbConnection = dbConnection;
};


/**
 * The property has `true` if user object has user data.
 */

User.prototype._inited = false;


/**
 * User hash object.
 */

User.prototype._curInstance= {};


User.prototype._savedInstance = {};


User.prototype._tempInstance = {};


User.prototype._isTransaction = false;


User.prototype.beginTransaction = function() {
    if (this._isTransaction) {
        return this;
    }
    this._savedInstance = Object.clone(this._curInstance);
    this._tempInstance = {};
    this._isTransaction = true;

    return this;
};


User.prototype.commit = function(callback) {
    if (!this._isTransaction) {
        return this;
    }
    this._isTransaction = false;
    this._savedInstance = Object.clone(this._curInstance);
    this._save(callback);

    return this;
};


User.prototype.rollback = function() {
    if (!this._isTransaction) {
        return this;
    }
    this._curInstance = Object.clone(this._savedInstance);
    this._tempInstance = {};
    this._isTransaction = false;

    return this;
};


User.prototype._save = function(callback) {
    if (this.isEmpty() || this._isTransaction) {
        return;
    }
    var changesObject = Object.clone(this._tempInstance);
    var _this = this;
    this._dbConnection.query('UPDATE users SET ? WHERE id = ?', [changesObject, this.getId()], function(err, result) {
        if (err) {
            return callback(err);
        }
        _this._dbConnection.commit(function(err) {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    });

    this._tempInstance = {};
};


/**
 * @return {boolean}
 */

User.prototype.isEmpty = function() {
    return !this._inited;
};


/**
 * Get user object
 *
 * @param {number} id
 * @return {User} User
 * @param {function} callback
 */

User.prototype.allocateById = function(id, callback) {
    if (!(typeof id === 'number')) {
        return callback(new TypeError('ID should be a number'));
    }
    var _this = this;
    this._dbConnection.query('SElECT * FROM users WHERE id = ?', [id], function(err, rows) {
        if (err) {
            return callback(err);
        }
        if (!rows.length) {
            return callback(new Error('User not found'));
        }
        _this._curInstance = rows[0];
        _this._inited = true;
        callback(null, _this);
    });
};


/**
 * Get user object by nick
 *
 * @param {string} nick
 * @return {User} User
 * @param {function} callback
 */

User.prototype.allocateByNick = function(nick, callback) {
    if (!nick || !(typeof nick === 'string') || !nick.length) {
        return callback(new TypeError('Nick should not be an empty or not a string'));
    }
    var _this = this;
    this._dbConnection.query('SElECT * FROM users WHERE nick = ?', [nick], function(err, rows) {
        if (err) {
            return callback(err);
        }
        if (!rows.length) {
            return callback(new Error('User not found'));
        }
        _this._curInstance = rows[0];
        _this._inited = true;
        callback(null, _this);
    });
};


/**
 * Getters
 */

User.prototype.getId = function(withTransaction) {
    if (this.isEmpty()) {
        return false;
    }
    if (!withTransaction && this._isTransaction) {
        return this._savedInstance.id;
    }
    return this._curInstance.id;
};


User.prototype.getNick = function(withTransaction) {
    if (this.isEmpty()) {
        return false;
    }
    if (!withTransaction && this._isTransaction) {
        return this._savedInstance.nick;
    }
    return this._curInstance.nick;
};


User.prototype.getEmail = function(withTransaction) {
    if (this.isEmpty()) {
        return false;
    }
    if (!withTransaction && this._isTransaction) {
        return this._savedInstance.email;
    }
    return this._curInstance.email;
};


User.prototype.getRegisterTimestamp = function(withTransaction) {
    if (this.isEmpty()) {
        return false;
    }
    if (!withTransaction && this._isTransaction) {
        return this._savedInstance.register_ts;
    }
    return this._curInstance.register_ts;
};


User.prototype.getLoginTimestamp = function(withTransaction) {
    if (this.isEmpty()) {
        return false;
    }
    if (!withTransaction && this._isTransaction) {
        return this._savedInstance.login_ts;
    }
    return this._curInstance.login_ts;
};


/**
 * Setters
 */

User.prototype._setProperty = function(property, value, callback) {
    this._tempInstance[property] =
        this._curInstance[property] = value;

    if (!this._isTransaction && typeof callback === 'function') {
        this._save(callback);
    }
};


User.prototype.setNick = function(value, callback) {
    if (!value || typeof value !== 'string' || !value.length) {
        return this;
    }
    this._setProperty('nick', value, callback);

    return this;
};

User.prototype.setEmail = function(value, callback) {
    if (!value || typeof value !== 'string' || !value.length) {
        return this;
    }
    this._setProperty('email', value, callback);

    return this;
};

User.prototype.updateLoginTimestamp = function(value, callback) {
    var curTime = Math.floor(new Date().getTime() / 1000);
    if (typeof value === 'function') {
        callback = value;
        value = curTime;
    } else if (!value && typeof value !== 'number') {
        value = curTime;
    }
    this._setProperty('login_ts', value, callback);

    return this;
};

module.exports = User;