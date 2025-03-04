const db = require("../config/db");
const BaseModel = require("./base.model");

const Organization = {
  ...BaseModel,
  getMembers: (organizationId) =>
    db("organization_members")
      .where("organization_id", organizationId)
      .join("users", "organization_members.user_id", "users.id")
      .join("user_roles", "organization_members.role_code", "user_roles.code")
      .select("users.*", "user_roles.name as role_name"),
  getBoards: (organizationId) =>
    db("boards").where("organization_id", organizationId).select("*"),
};

module.exports = Organization;
