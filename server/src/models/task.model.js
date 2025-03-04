const db = require("../config/db");
const BaseModel = require("./base.model");

const Task = {
  ...BaseModel,
  getWithDetails: (taskId) =>
    db("tasks")
      .where("tasks.id", taskId)
      .join("board_stages", "tasks.stage_id", "board_stages.id")
      .join("users as assigned_user", "tasks.assigned_to", "assigned_user.id")
      .join("users as creator", "tasks.created_by", "creator.id")
      .select(
        "tasks.*",
        "board_stages.name as stage_name",
        "assigned_user.username as assigned_to_username",
        "creator.username as created_by_username"
      ),
  getTags: (taskId) =>
    db("task_tags")
      .where("task_id", taskId)
      .join("tags", "task_tags.tag_id", "tags.id")
      .select("tags.*"),
  getHistory: (taskId) =>
    db("task_history")
      .where("task_id", taskId)
      .join("users", "task_history.user_id", "users.id")
      .select("task_history.*", "users.username")
      .orderBy("action_time", "desc"),
};

module.exports = Task;
