const db = require("../config/db");
const BaseModel = require("./base.model");

const UserRole = {
  ...BaseModel,
  getByCode: (code) => db("user_roles").where("code", code).first(),
};

module.exports = UserRole;
