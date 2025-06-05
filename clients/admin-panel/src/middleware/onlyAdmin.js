function onlyAdmin(req, res, next) {
  const userRoles =
    req.session.user &&
    (req.session.user.realm_access?.roles || req.session.user.resource_access?.['account']?.roles);

  if (!userRoles || !userRoles.includes('admin')) {
    res.redirect('/logout');
    return;
  }
  next();
}

module.exports = onlyAdmin;