const db = require("../config/db");
const BaseModel = require("./base.model");

const Tag = {
  ...BaseModel,
  getTasks: (tagId) =>
    db("task_tags")
      .where("tag_id", tagId)
      .join("tasks", "task_tags.task_id", "tasks.id")
      .select("tasks.*"),
};

module.exports = Tag;
