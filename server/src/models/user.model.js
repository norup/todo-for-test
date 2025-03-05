const db = require("../config/db");
const BaseModel = require("./base.model");

const User = {
  ...BaseModel,
  createUser: (userData) => db("users").insert(userData).returning("*"),
  getByEmail: (email) => db("users").where("email", email).first(),
  getByUsername: (username) => db("users").where("username", username).first(),
  getOrganizationMemberships: (userId) =>
    db("organization_members")
      .where("user_id", userId)
      .join(
        "organizations",
        "organization_members.organization_id",
        "organizations.id"
      )
      .join("user_roles", "organization_members.role_code", "user_roles.code")
      .select("organizations.*", "user_roles.name as role_name"),
};

module.exports = User;
