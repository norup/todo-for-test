const db = require("../config/db");
const BaseModel = require("./base.model");

const OrganizationMember = {
  ...BaseModel,
  getMemberRole: (userId, organizationId) =>
    db("organization_members")
      .where({
        user_id: userId,
        organization_id: organizationId,
      })
      .join("user_roles", "organization_members.role_code", "user_roles.code")
      .select("user_roles.*")
      .first(),
};

module.exports = OrganizationMember;
