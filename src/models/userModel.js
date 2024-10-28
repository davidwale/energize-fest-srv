const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    verificationCode: { type: Number },
    codeExpiresAt: { type: Date }     
});

const User = mongoose.model('User', userSchema);

module.exports = User;
