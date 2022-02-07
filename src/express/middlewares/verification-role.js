'use strict';

module.exports = (req, res, next) => {
  const {user} = req.session;

  if (user.role !== `administrator`) {
    return res.redirect(`/`);
  }
  return next();
};
