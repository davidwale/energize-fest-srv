const { Router } = require('express');
const {
    signUpController,
    loginController,
    forgotPasswordController,
    verifyCodeController,
    resetPasswordController,
} = require('../controller/auth.controller');
const passport = require('passport');
const { generateToken } = require('../middleware/authMiddleware');

const authRouter = Router();

authRouter.post('/signup', signUpController);
authRouter.post('/login', loginController);
authRouter.post('/forgot-password', forgotPasswordController);
authRouter.post('/verify-code', verifyCodeController);
authRouter.post('/reset-password', resetPasswordController);

const googleAuthRouter = Router();

googleAuthRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

googleAuthRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`/auth/success?token=${token}`);
});

googleAuthRouter.get('/success', (req, res) => {
    const { token, username } = req.query;
    res.json({ message: 'Google OAuth successful', token });
});

module.exports = { authRouter, googleAuthRouter };

