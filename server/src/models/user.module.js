const db = require("../config/db");

const User = {
  getAll: () => db("users").select("*").returning("*"),
  getById: (id) => db("users").where("id", id).first(),
  create: (user) => db("users").insert(user).returning("*"),
  update: (id, user) => db("users").where("id", id).update(user).returning("*"),
  delete: (id) => db("users").where("id", id).del(),
};

module.exports = User;
