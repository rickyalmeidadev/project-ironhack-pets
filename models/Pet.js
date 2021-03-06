const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PetSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  species: {
    type: String,
    enum: ['Cachorro', 'Gato', 'Ave', 'Coelho', 'Tartaruga', 'Outro'],
    default: 'Outro',
  },
  birthdate: String, // YYYY-MM-DD
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  path: {
    type: String,
    default: '/images/paw.svg'
  },
  originalName: String,
});

const Pet = mongoose.model('Pet', PetSchema);

module.exports = Pet;
