const mongoose = require('mongoose');

// Mongoose schema used to store fun facts about U.S. states.
const stateSchema = new mongoose.Schema({
  stateCode: {
    type: String,    //state abbreviation
    required: true,  //has to be present
    unique: true     //only one per state
  },
  funfacts: [String]  //Array
});

module.exports = mongoose.model('State', stateSchema);