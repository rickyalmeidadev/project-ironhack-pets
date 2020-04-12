const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  pets: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Pet',
    },
  ],
  // Bonus: Image
  path: String,
  originalName: String,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
