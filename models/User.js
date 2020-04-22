const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  googleID: String,
  accessToken: String,
  refreshToken: String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
