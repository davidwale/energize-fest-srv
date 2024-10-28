const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { sendEmail } = require('../utils/email');

const createUser = async (email, password) => {
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { success: false, message: 'Email already registered' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();

        return { success: true, message: 'User created successfully' };
    } catch (error) {
        return { success: false, message: error, error: error };
    }
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        return { success: false, message: 'Email does not Exist' };
    }
    if (!(await bcrypt.compare(password, user.password))) {
        return { success: false, message: 'Password is incorrect' };
    }

    return { success: true, userId: user._id };
};

const sendVerificationCode = async (email) => {
    const code = crypto.randomInt(100000, 999999).toString();
    const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); 

    let user = await User.findOne({ email });

    if (!user) {
        return { success: false, message: 'User not found' };
    }

    user.verificationCode = code;
    user.codeExpiresAt = codeExpiresAt;

    await user.save();
    await sendEmail(email, code);

    return { success: true, message: 'Verification code sent successfully' };
};

const verifyCode = async (email, code) => {
    const user = await User.findOne({ email });

    if (!user) {
        return { success: false, message: 'Email is required' };
    }

    if (user.verificationCode !== code) {
        return { success: false, message: 'Invalid verification code' };
    }

    if (new Date() > user.codeExpiresAt) {
        await sendVerificationCode(email);
        return { success: false, message: 'Verification code as expired a new one has been sent to your email' };
    }

    user.verificationCode = undefined;
    user.codeExpiresAt = undefined;
    await user.save();

    return { success: true, userId: user._id };
};

const resetPassword = async (email, newPassword, code) => {
    const user = await User.findOne({ email });

    if (!user) {
        return { success: false, message: 'User not found' };
    }

    if (user.verificationCode !== code) {
        return { success: false, message: 'Invalid verification code' };
    }

    if (new Date() > user.codeExpiresAt) {
        await sendVerificationCode(email);
        return { success: false, message: 'Verification code as expired a new one has been sent to your email' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { success: true, message: 'Password reset successfully' };
};

module.exports = { createUser, loginUser, sendVerificationCode, verifyCode, resetPassword };
