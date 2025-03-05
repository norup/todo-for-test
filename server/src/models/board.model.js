const db = require("../config/db");
const BaseModel = require("./base.model");

const Board = {
  ...BaseModel,
  createBoard: (boardData) => db("boards").insert(boardData),
  getStages: (boardId) =>
    db("board_stages")
      .where("board_id", boardId)
      .orderBy("position", "asc")
      .select("*"),
  getTasks: (boardId) =>
    db("tasks")
      .where("board_id", boardId)
      .join("board_stages", "tasks.stage_id", "board_stages.id")
      .select("tasks.*", "board_stages.name as stage_name"),
  getTags: (boardId) => db("tags").where("board_id", boardId).select("*"),
};

module.exports = Board;
