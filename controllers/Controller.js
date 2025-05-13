//This file handles /state routes in the REST API
const path = require('path');
const fs = require('fs');
const State = require('../models/StatesMD'); //fun fact Mongoose model

// This loads and parse the stateData.json when startign up,
// so no reading files on each request
const statesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'statesData.json'))
);

// Validates state code and ensures uppercase
const validStateCodes = new Set(statesData.map(state => state.code.toUpperCase()));
function isValidStateCode(code) {
  return validStateCodes.has(code.toUpperCase());
}

// Merges fun facts from MongoB in state
async function mergeFunFacts(state) {
  const funFactsDoc = await State.findOne({ stateCode: state.code });
  if (funFactsDoc && funFactsDoc.funfacts && funFactsDoc.funfacts.length > 0) {
    return { ...state, funfacts: funFactsDoc.funfacts };
  }
  return state;
}

// Getting a state from the static data by its code example - Georgia = GA
function getStateDataByCode(code) {
  return statesData.find(
    (state) => state.code.toUpperCase() === code.toUpperCase()
  );
}


// GET /states/, returning all states, can be filtered by contigous
exports.getAllStates = async (req, res) => {
  let filteredStates = statesData;

  // Filters contigous  or not used AK as in Alaska and HI as in Hawaii
  if (req.query.contig === 'true') {
    filteredStates = statesData.filter(
      (state) => state.code !== 'AK' && state.code !== 'HI'
    );
  } else if (req.query.contig === 'false') {
    filteredStates = statesData.filter(
      (state) => state.code === 'AK' || state.code === 'HI'
    );
  }

  // Merge fun facts for all states from DB
  const statesWithFunFacts = await Promise.all(
    filteredStates.map(mergeFunFacts)
  );
  res.json(statesWithFunFacts);
};

// GET /states/:state, returning a single state by code, along with funfact if availible
exports.getState = async (req, res) => {
  const code = req.params.state.toUpperCase();
  if (!isValidStateCode(code)) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }
  const state = getStateDataByCode(code);
  const merged = await mergeFunFacts(state);
  res.json(merged);
};

// GET /states/:state/capital
exports.getCapital = (req, res) => {
  const code = req.params.state.toUpperCase();
  if (!isValidStateCode(code)) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }
  const state = getStateDataByCode(code);
  res.json({ state: state.state, capital: state.capital_city });
};

// GET /states/:state/funfact, Random fun fact for the state or error message
exports.getRandomFunFact = async (req, res) => {
    const code = req.params.state.toUpperCase();
    if (!isValidStateCode(code)) {
      return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
    }
    const state = getStateDataByCode(code);
    const funFactsDoc = await State.findOne({ stateCode: code });
    if (!funFactsDoc || !funFactsDoc.funfacts || funFactsDoc.funfacts.length === 0) {
      return res.status(404).json({ message: `No Fun Facts found for ${state.state}` });
    }
    const randomFact =
      funFactsDoc.funfacts[Math.floor(Math.random() * funFactsDoc.funfacts.length)];
    res.json({ funfact: randomFact });
  };

// GET /states/:state/nickname
exports.getNickname = (req, res) => {
  const code = req.params.state.toUpperCase();
  if (!isValidStateCode(code)) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }
  const state = getStateDataByCode(code);
  res.json({ state: state.state, nickname: state.nickname });
};

// GET /states/:state/population
exports.getPopulation = (req, res) => {
    const code = req.params.state.toUpperCase();
    if (!isValidStateCode(code)) {
      return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
    }
    const state = getStateDataByCode(code);
    // Format the population with commas and as a string
    const formattedPopulation = state.population.toLocaleString('en-US');
    res.json({ state: state.state, population: formattedPopulation });
  };

// GET /states/:state/admission
exports.getAdmission = (req, res) => {
  const code = req.params.state.toUpperCase();
  if (!isValidStateCode(code)) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }
  const state = getStateDataByCode(code);
  res.json({ state: state.state, admitted: state.admission_date });
};

// PATCH /states/:state/funfact
exports.updateFunFact = async (req, res) => {
    const code = req.params.state.toUpperCase();
    if (!isValidStateCode(code)) {
      return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
    }
    const state = getStateDataByCode(code);
    const { index, funfact } = req.body;
    if (!index) {
      return res.status(400).json({ message: 'State fun fact index value required' });
    }
    if (!funfact) {
      return res.status(400).json({ message: 'State fun fact value required' });
    }
    const funFactsDoc = await State.findOne({ stateCode: code });
    if (!funFactsDoc || !Array.isArray(funFactsDoc.funfacts) || funFactsDoc.funfacts.length === 0) {
      return res.status(404).json({ message: `No Fun Facts found for ${state.state}` });
    }
    const idx = index - 1; // 0 based 
    if (idx < 0 || idx >= funFactsDoc.funfacts.length) {
      return res.status(400).json({ message: `No Fun Fact found at that index for ${state.state}` });
    }
    funFactsDoc.funfacts[idx] = funfact;
    await funFactsDoc.save();
    res.json(funFactsDoc);
  };

// DELETE /states/:state/funfact
exports.deleteFunFact = async (req, res) => {
    const code = req.params.state.toUpperCase();
    if (!isValidStateCode(code)) {
      return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
    }
    const state = getStateDataByCode(code);
    const { index } = req.body;
    if (!index) {
      return res.status(400).json({ message: 'State fun fact index value required' });
    }
    const funFactsDoc = await State.findOne({ stateCode: code });
    if (!funFactsDoc || !Array.isArray(funFactsDoc.funfacts) || funFactsDoc.funfacts.length === 0) {
      return res.status(404).json({ message: `No Fun Facts found for ${state.state}` });
    }
    const idx = index - 1; // Convert to zero-based
    if (idx < 0 || idx >= funFactsDoc.funfacts.length) {
      return res.status(400).json({ message: `No Fun Fact found at that index for ${state.state}` });
    }
    funFactsDoc.funfacts.splice(idx, 1);
    await funFactsDoc.save();
    res.json(funFactsDoc);
  };

// POST /states/:state/funfact
exports.addFunFacts = async (req, res) => {
    const code = req.params.state.toUpperCase();
    if (!isValidStateCode(code)) {
      return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
    }
    const { funfacts } = req.body;
    if (!funfacts) {
      return res.status(400).json({ message: 'State fun facts value required' });
    }
    if (!Array.isArray(funfacts)) {
      return res.status(400).json({ message: 'State fun facts value must be an array' });
    }
    if (funfacts.length === 0) {
      return res.status(400).json({ message: 'State fun facts array must not be empty' });
    }
    let funFactsDoc = await State.findOne({ stateCode: code });
    if (funFactsDoc) {
      funFactsDoc.funfacts.push(...funfacts);
      await funFactsDoc.save();
    } else {
      funFactsDoc = await State.create({ stateCode: code, funfacts });
    }
    res.json(funFactsDoc);
  };