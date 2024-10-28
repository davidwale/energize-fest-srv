const { sendVerificationCode, verifyCode, resetPassword, createUser, loginUser } = require('../services/authService');
const { generateToken } = require('../middleware/authMiddleware');

const signUpController = async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ status: false, message: 'Email is required.' });
    }

    if (!password) {
        return res.status(400).json({ status: false, message: 'password is required.' });
    }

    try {
        const result = await createUser(email, password);
        if (result.success) {
            const token = generateToken(result.userId);
            return res.status(201).json({
                status: true,
                message: 'User signed up successfully',
                data: { token }
            });
        } else {
            return res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

const loginController = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: false, message: 'Email and password are required.' });
    }

    try {
        const result = await loginUser(email, password);
        if (result.success) {
            const token = generateToken(result.userId);
            return res.status(200).json({
                status: true,
                message: 'User logged in successfully',
                data: { token }
            });
        } else {
            return res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

const forgotPasswordController = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ status: false, message: 'Email is required' });
    }

    try {
        const result = await sendVerificationCode(email);
        if (result.success) {
            return res.status(200).json({ status: true, message: 'Verification code sent successfully' });
        } else {
            return res.status(500).json({ status: false, message: result.message });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

const verifyCodeController = async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ status: false, message: 'Email and code are required' });
    }

    try {
        const result = await verifyCode(email, code);
        if (result.success) {
            return res.status(200).json({ status: true, message: 'Code verified successfully' });
        } else {
            return res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

const resetPasswordController = async (req, res) => {
    const { email, newPassword, code } = req.body;

    if (!email || !newPassword || !code) {
        return res.status(400).json({ status: false, message: 'Email, new password, and code are required' });
    }

    try {
        const result = await resetPassword(email, newPassword, code);
        if (result.success) {
            return res.status(200).json({ status: true, message: 'Password reset successfully' });
        } else {
            return res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    signUpController,
    loginController,
    forgotPasswordController,
    verifyCodeController,
    resetPasswordController
};
