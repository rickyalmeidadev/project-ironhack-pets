const getIndex = (req, res, next) => {
  if (req.user) {
    const obj = { user: req.user };
    res.render('index', { obj });
    return;
  }
  res.render('index', { message: req.flash('error') });
};

module.exports = indexController = { getIndex };
