function checkRole(requiredRole) {
    return (req, res, next) => {
        const userRoles =
            req.user &&
            (req.user.realm_access?.roles || req.user.resource_access?.['account']?.roles);

        if (!userRoles || !userRoles.includes(requiredRole)) {
            return res.status(403).json({ message: 'Brak odpowiednich uprawnień' });
        }

        next();
    };
}

module.exports = checkRole;