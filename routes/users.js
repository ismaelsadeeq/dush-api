const express = require('express');

const router = express.Router();
const passport = require('passport')
const controller = require('../controllers/user.controller');
router.get('/',
  passport.authenticate('jwt',{session:false}),
  controller.getUser
)

module.exports = router;