
// 
const express = require('express');
const router = express.Router();

// Controller
const statesController = require('../controllers/Controller');

// GET routes
router.get('/', statesController.getAllStates);

router.get('/:state', statesController.getState);

router.get('/:state/funfact', statesController.getRandomFunFact);

router.get('/:state/capital', statesController.getCapital);

router.get('/:state/nickname', statesController.getNickname);

router.get('/:state/population', statesController.getPopulation);

router.get('/:state/admission', statesController.getAdmission);

// POST route
router.post('/:state/funfact', statesController.addFunFacts);

// PATCH route
router.patch('/:state/funfact', statesController.updateFunFact);

// DELETE route
router.delete('/:state/funfact', statesController.deleteFunFact);

module.exports = router;