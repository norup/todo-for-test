const db = require("../config/db");
const BaseModel = require("./base.model");

const Comment = {
  ...BaseModel,
  getThread: (commentId) =>
    db("comments")
      .where("id", commentId)
      .orWhere("reply_to_comment_id", commentId)
      .join("users", "comments.created_by", "users.id")
      .select("comments.*", "users.username")
      .orderBy("created_at", "asc"),
};

module.exports = Comment;
