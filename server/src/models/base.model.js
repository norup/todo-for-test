const db = require("../config/db");

const BaseModel = {
  getAll: (tableName) => db(tableName).select("*").returning("*"),
  getById: (tableName, id) => db(tableName).where("id", id).first(),
  create: (tableName, data) => db(tableName).insert(data).returning("*"),
  update: (tableName, id, data) =>
    db(tableName).where("id", id).update(data).returning("*"),
  delete: (tableName, id) => db(tableName).where("id", id).del(),
  getActive: (tableName) => db(tableName).where("is_active", true).select("*"),
};

module.exports = BaseModel;
