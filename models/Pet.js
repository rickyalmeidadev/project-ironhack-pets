const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PetSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  species: {
    type: String,
    enum: ['Cachorro', 'Gato', 'Calopsita', 'Coelho', 'Tartaruga', 'Outro'],
    default: 'Outro',
  },
  birthdate: String, // YYYY-MM-DD
  events: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event',
    },
  ],
  // Bonus: Image
  path: String,
  originalName: String,
});

const Pet = mongoose.model('Pet', PetSchema);

module.exports = Pet;
