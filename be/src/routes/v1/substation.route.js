const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const substationController = require('../../controllers/substation.controller');
const transformerValidation = require('../../validations/transformer.validation');
const router = express.Router();

router
  .route('/')
  .get( substationController.getSubstations)
  .post(substationController.createSubstation)
  

module.exports = router;