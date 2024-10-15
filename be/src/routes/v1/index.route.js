const express = require('express');
const auth = require('../../middlewares/auth');
const indexController = require('../../controllers/index.controller');
const validate = require('../../middlewares/validate');
const indexValidation = require('../../validations/index.validation');

const router = express.Router();

router
  .route('/')
  .get(auth("getIndexes"), indexController.getIndexes)
  .post(auth("createIndexes"), validate(indexValidation.createIndex), indexController.createIndex);

router
  .route('/getIndexesByDay/:transformerId')
  .get(auth("getIndexes"), indexController.getIndexesByDay)

  router
  .route('/getIndexesByTransformer/:transformerId')
  .get(auth("getIndexes"), indexController.getIndexesByTransformer);

router
  .route('/createIndexes')
  .post(indexController.createIndexes)

module.exports = router;