const userService = require("./user.service");

const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  res.status(200).json(users);
};

const getUserById = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json(user);
};

module.exports = {
  getAllUsers,
  getUserById,
};
