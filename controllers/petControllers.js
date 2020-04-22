const Pet = require('../models/Pet');
const Event = require('../models/Event');

const { getDateNow } = require('../helpers/getDateNow');

const getPetFilter = (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  let { eventRange, eventType } = req.query;

  const dateForFilter = getDateNow();

  let query = {};

  if (eventRange === 'filterDate' && eventType !== 'all') {
    query = {
      date: { $gt: dateForFilter },
      type: eventType,
    };
  } else if (eventRange === 'filterDate' && eventType === 'all') {
    query = {
      date: { $gt: dateForFilter },
    };
  } else if (eventRange === 'all' && eventType !== 'all') {
    query = {
      type: eventType,
    };
  }

  query.owner = id;

  Pet.findById(id)
    .populate('owner')
    .then(pet => {
      Event.find(query)
        .sort({ date: 1 })
        .then(events => {
          const obj = { pet, user, events };
          res.render('pet', { obj });
        })
        .catch(() => {
          const obj = { user, pet };
          res.render('pet', { obj });
        });
    })
    .catch(() => res.redirect('/user'));
};

const getPetDetails = (req, res, next) => {
  const { user } = req;
  const { id } = req.params;

  const dateForFilter = getDateNow();

  Pet.findById(id)
    .populate('owner')
    .then(pet => {
      Event.find({ owner: id, date: { $gt: dateForFilter } })
        .sort({ date: 1 })
        .then(events => {
          const obj = { user, pet, events };
          res.render('pet', { obj });
        })
        .catch(() => {
          const obj = { user, pet };
          res.render('pet', { obj });
        });
    })
    .catch(() => res.redirect('/user'));
};

const postPetAdd = (req, res, next) => {
  const { name, species, birthdate } = req.body;
  const { _id } = req.user;

  if (req.file) {
    const { url, originalname } = req.file;
    const customUrl = url.split('upload/').join('upload/c_thumb,g_auto,h_500,r_0,w_500,x_0/');

    Pet.create({
      name,
      species,
      birthdate,
      owner: _id,
      path: customUrl,
      originalName: originalname,
    })
      .then(pet => res.redirect(`/pet/${pet._id}`))
      .catch(() => res.redirect('/user'));
  } else {
    Pet.create({
      name,
      species,
      birthdate,
      owner: _id,
    })
      .then(pet => res.redirect(`/pet/${pet._id}`))
      .catch(() => res.redirect('/user'));
  }
};

const postPetEditPhoto = (req, res, next) => {
  const { id } = req.params;
  const { url, originalname } = req.file;

  const customUrl = url.split('upload/').join('upload/c_thumb,g_auto,h_500,r_0,w_500,x_0/');

  Pet.findByIdAndUpdate(id, { path: customUrl, originalName: originalname }, { new: true })
    .then(pet => res.redirect(`/pet/${pet._id}`))
    .catch(() => res.redirect('/user'));
};

const postPetEdit = (req, res, next) => {
  const { name, species, birthdate } = req.body;
  const { id } = req.params;

  Pet.findByIdAndUpdate(id, { name, species, birthdate }, { new: true })
    .then(pet => res.redirect(`/pet/${pet._id}`))
    .catch(() => res.redirect('/user'));
};

const getPetDelete = (req, res, next) => {
  const { id } = req.params;
  Event.deleteMany({ owner: id }, () => {
    Pet.findByIdAndDelete(id, () => res.redirect('/user'));
  });
};

module.exports = petController = {
  getPetFilter,
  getPetDetails,
  postPetAdd,
  postPetEditPhoto,
  postPetEdit,
  getPetDelete,
};
