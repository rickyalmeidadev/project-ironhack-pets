const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Vacina', 'Consulta', 'Cirurgia', 'Banho/Tosa', 'Aniversario', 'Outros'],
    default: 'Outros',
  },
  description: String,
  date: String, // YYYY-MM-DD
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Pet',
  },
  // Bonus: Location
  location: {
    type: {
      type: String,
    },
    coordinates: [Number],
  },
});

EventSchema.index({ location: '2dsphere' });

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
