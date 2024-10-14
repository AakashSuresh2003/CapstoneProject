const checkAdminRole = (req, res, next) => {
  const user = req.user;

  if (user.role !== "admin") {
    return res
      .status(401)
      .json({message:"Unauthorized User (Only Admin can access this route)"});
  }
  next(); 
};

const checkAdminAndHrRole = (req, res, next) => {
  console.log(req.user);
    if (req.user && req.user.role) {
        const { role } = req.user;
        if (role === 'admin' || role === 'hr') {
            return next();
        } else {
            return res.status(403).json({ message: 'Access forbidden: Requires admin or HR role' });
        }
    } else {
        return res.status(401).json({ message: 'Unauthorized: User role not found' });
    }
};

const checkAccountantRole = (req, res, next) => {
  const user = req.user;
  if (user.role !== "accountant")
    return res
      .status(401)
      .json({messgae:"Unauthorized User (Only Accountant can access this route)"});
  next();
}

module.exports = { checkAdminRole, checkAdminAndHrRole , checkAccountantRole};
