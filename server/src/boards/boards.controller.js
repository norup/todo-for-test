const boardService = require("./boards.service");

const handleError = (res, message, error, status = 500) => {
  res.status(status).json({ message, error: error.message });
};

const getBoards = async (req, res) => {
  try {
    const boards = await boardService.getBoards(req.query);
    res.json(boards);
  } catch (error) {
    handleError(res, "Error fetching boards", error);
  }
};

const getBoardById = async (req, res) => {
  try {
    const { id } = req.params;
    const board = await boardService.getBoardById(id);

    if (!board) {
      return handleError(
        res,
        "Board not found",
        { message: "Board not found" },
        404
      );
    }

    res.json(board);
  } catch (error) {
    handleError(res, "Error fetching board", error);
  }
};

const createBoard = async (req, res) => {
  try {
    const board = await boardService.createBoard(req.body);
    res.status(201).json(board);
  } catch (error) {
    handleError(res, "Error creating board", error);
  }
};

const updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const board = await boardService.updateBoard(id, req.body);

    if (!board) {
      return handleError(
        res,
        "Board not found",
        { message: "Board not found" },
        404
      );
    }

    res.json(board);
  } catch (error) {
    handleError(res, "Error updating board", error);
  }
};

const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await boardService.deleteBoard(id);

    if (!result) {
      return handleError(
        res,
        "Board not found",
        { message: "Board not found" },
        404
      );
    }

    res.status(204).send();
  } catch (error) {
    handleError(res, "Error deleting board", error);
  }
};

module.exports = {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
};
