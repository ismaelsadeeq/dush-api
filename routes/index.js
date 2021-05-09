const express = require('express');

const router = express.Router();
const passport = require('passport')
const controller = require('../controllers/auth.controller');

router.post('/signup',
  controller.register
);
router.post('/login',
  controller.login
);
router.post('/send-code', 
  controller.sendCode
);
router.post('/send-celo', 
  passport.authenticate("jwt",{session:false}),
  controller.sendCelo
);
router.post('/send-cusd', 
  passport.authenticate("jwt",{session:false}),
  controller.sendCusd
);
router.get('/balance', 
  passport.authenticate("jwt",{session:false}),
  controller.accountBalance
);
router.post('/verify-email', 
  controller.verifyEmail
);
router.post('/reset-password', 
  controller.resetPassword
);
router.get('/logout',
  passport.authenticate('jwt',{session:false}),
  controller.logout
)

module.exports = router;