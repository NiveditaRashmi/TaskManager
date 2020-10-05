const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
// const { METHODS } = require('http');
const bcrypt = require('bcryptjs');

// JWT Secret
const jwtSecret = 798908035819284340319809099804;
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    sessions: [{
        token: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Number,
            required: true
        }
    }]
});

/**INSTANCE METHODS */
UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObjct();

    // return the document except the password and sessions(these shouldn't be made available)
    return _.omit(userObject, ['password', 'sessions']);
}

UserSchema.methods.generateAccessAuthToken = function() {
    const user = this;
    return new Promise((resolve, reject) => {
        //create the json web token and return that.
        jwt.sign({_id: user._id.toHexString()}, jwtSecret, { expiresIn: "15m"}, (err, token) => {
            if(!err ) {
                resolve(token);
            } else {
                reject();
            }
        })
    })
}

UserSchema.methods.generateRefreshAuthToken = function() {
    // this method simply generates a 64byte hex string- doesn't save it to database. saveSessiontoDatabase() does that.
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if(!err) {
                let token = buf.toString('hex');

                return resolve(token);
            }
        })
    })
}
UserSchema.methods.createSession = function() {
    let user = this;

    return user.generateRefreshAuthToken().then((refreshToken) => {
        return saveSessionToDatabase(user, refreshToken);
    }).then((refreshToken) => {
        // saves to database successfully
        // now return the refresh token
        return refreshToken;
    }).catch((e) => {
        return Promise.reject("Failed to save session to database." + e);
    })
}

// MODEL(STATIC METHODS)-- can be called on user model class but not the objects of the class
UserSchema.statics.findByIdAndToken = function(_id, token) {
    // used to auth middleware(verifySession)
    const User= this;
    return User.findOne({
        _id,
        'session.token': token
    });
} 

UserSchema.statics.findByCredentials = function(email, password) {
    let User = this;
    return User.findOne({email}).then((user) => {
        if(!user) return Promise.reject();

        return new Promise((resolve, reject) => {
            if(res) resolve(user);
            else {
                reject();
            }
        })
    })
}

UserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
    let secondsSinceEpoch = Date.now() / 1000;
    if(expiresAt > secondsSinceEpoch) {
        // hasn't expired
        return false;
    } else {
        // has expired
        return true;
    }
}

/**MIDDLEWARE */
// before a user document is saved, this code runs
UserSchema.pre("save", function (next) {
    let user = this;
    let costFactor = 10;

    if(user.isModified("password")) {
        bcrypt.genSalt(costFactor, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})


/**HELPER METHODS */
let saveSessionToDatabase = (err, refreshToken) => {
    //save session to database
    return new Promise((resolve, reject) => {
        let expiresAt = generateRefreshTokenExpiryTime();

        user.sessions.push({"token": refreshToken, expiresAt});
        user.save().then(() => {
            //saved session successfully
            return resolve(refreshToken);
        }).catch((e) => {
            return resolve(refreshToken);
        }).catch((e) => {
            reject(e);
        })
    })
}

let generateRefreshTokenExpiryTime = () => {
    let daysUntilExpire = "10";
    let secondsUntilExpire = ((daysUntilExpire * 24) * 60) * 60;
    return ((Date.now() / 1000) + secondsUntilExpire);
}

const User = mongoose.model("User", UserSchema);

module.exports = { User }