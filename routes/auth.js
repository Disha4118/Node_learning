const express = require('express');

const authController = require('../controllers/auth');
const User = require('../models/user');
const router = express.Router();
const {check, body}=require('express-validator')
router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup',
    [check('email').isEmail().withMessage('Please enter a valid email')
    .custom(async (value, { req }) => {
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
          throw new Error('E-Mail exists already, please pick a different one.');
        }
    }),
    body('password', 'Please enter a password of atleast length 5 and must be alphanumeric')
    .isLength({min: 5})
    .isAlphanumeric(),
    body('confirmPassword').custom((value, {req})=>{
        if(value!==req.body.password){
            throw new Error('Password do not match');
        }
        return true;
    })]
    ,
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
