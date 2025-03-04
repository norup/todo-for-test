const User = require("../models/user.module");

const getAllUsers = async () => {
  const users = await User.getAll();
  return users;
};

const getUserById = async (id) => {
  const user = await User.getById(id);
  return user;
};

module.exports = {
  getAllUsers,
  getUserById,
};
