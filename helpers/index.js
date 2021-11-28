exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
exports.isNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }