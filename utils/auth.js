// middleware to check if the user is logged in
const withAuth = (req, res, next) => {
  // if the user isn't logged in, redirect them to the login route
  if (!req.session.logged_in) {
    res.redirect("/login");
  } else {
    next();
  }
};

module.exports = withAuth;
