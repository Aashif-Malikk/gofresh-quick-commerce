exports.authorize = (...roles) => {
    return (req, res, next) => {
        console.log(roles);
        console.log(req.userRole);

        if (!roles.includes(req.userRole)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        next();
    };
};