const Board = require("../models/board.model");
const Task = require("../models/task.model");

const DEFAULT_LIMIT = 10;
const DEFAULT_ORDER_BY = "created_at";

const getBoards = async (filters = {}) => {
  const {
    organizationId,
    userId,
    limit = DEFAULT_LIMIT,
    orderBy = DEFAULT_ORDER_BY,
    type,
    isActive,
  } = filters;

  if (!organizationId && !userId) {
    return handleError(
      res,
      "Organization ID or User ID is required",
      null,
      400
    );
  }

  let query = Board.getAll()
    .where("organization_id", organizationId)
    .select([
      "boards.id",
      "boards.title",
      "boards.description",
      "boards.is_private as type",
      "boards.is_active",
    ])
    .count("tasks.id as count_of_tasks")
    .leftJoin("tasks", "boards.id", "tasks.board_id")
    .groupBy("boards.id");

  if (userId) {
    query = query.where("boards.created_by", userId);
  }

  if (type) {
    query = query.where("boards.is_private", type === "private");
  }

  if (isActive !== undefined) {
    query = query.where("boards.is_active", isActive);
  }

  return await query.orderBy(orderBy, "desc").limit(limit);
};

const processTasks = async (tasks) => {
  return Promise.all(
    tasks.map(async (task) => {
      const tags = await Task.getTags(task.id);
      return {
        id: task.id,
        title: task.title,
        description: task.content
          ? `${task.content.substring(0, 100)}${
              task.content.length > 100 ? "..." : ""
            }`
          : "",
        assignee: task.assigned_to_username,
        y_position: task.y_position,
        priority_code: task.priority_code,
        stage_id: task.stage_id,
        tags: tags.map(({ id, name }) => ({ id, name })),
      };
    })
  );
};

const getBoardById = async (boardId) => {
  if (!boardId) {
    throw new Error("Board ID is required");
  }

  const board = await Board.getById(boardId);
  if (!board) return null;

  const tasks = await Task.getWithDetails(boardId);
  const processedTasks = await processTasks(tasks);

  return {
    id: board.id,
    title: board.title,
    description: board.description,
    isActive: board.is_active,
    countOfTasks: tasks.length,
    tasks: processedTasks,
  };
};

const createBoard = async ({ name, description, token }) => {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error("User not found");
    }

    const board = await Board.createBoard({
      name,
      description,
      created_by: user.id,
      organization_id: user.organization_id,
    });

    return board;
  } catch (error) {
    console.error("Error creating board", error);
    throw new Error("Failed to create board");
  }
};

const updateBoard = async (boardId, boardData) => {
  if (!boardId || !boardData) {
    throw new Error("Board ID and data are required");
  }
  return Board.update(boardId, boardData);
};

const deleteBoard = async (boardId) => {
  if (!boardId) {
    throw new Error("Board ID is required");
  }
  return Board.delete(boardId);
};

module.exports = {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
};
